import fs from "fs"
import path from "path"

// This script extracts the contract address from the latest Ignition deployment
// and saves it to config/contract-address.json for the frontend to use

async function main() {
  try {
    // Find the latest deployment in the ignition/deployments folder
    const deploymentsDir = path.join(__dirname, "..", "ignition", "deployments")

    if (!fs.existsSync(deploymentsDir)) {
      console.error("No Ignition deployments found. Please deploy with Ignition first.")
      process.exit(1)
    }

    // Get all network folders
    const networks = fs.readdirSync(deploymentsDir)

    if (networks.length === 0) {
      console.error("No network deployments found.")
      process.exit(1)
    }

    // Use the first network (usually localhost or hardhat)
    const networkDir = path.join(deploymentsDir, networks[0])

    // Get all deployment folders (sorted by date, newest first)
    const deployments = fs
      .readdirSync(networkDir)
      .filter((dir) => !dir.startsWith("."))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(networkDir, a))
        const statB = fs.statSync(path.join(networkDir, b))
        return statB.mtime.getTime() - statA.mtime.getTime()
      })

    if (deployments.length === 0) {
      console.error("No deployments found in the network directory.")
      process.exit(1)
    }

    // Get the latest deployment
    const latestDeployment = deployments[0]
    const deploymentDir = path.join(networkDir, latestDeployment)

    // Read the chain artifacts file
    const chainArtifactsPath = path.join(deploymentDir, "chain-artifacts.json")

    if (!fs.existsSync(chainArtifactsPath)) {
      console.error("Chain artifacts file not found in the latest deployment.")
      process.exit(1)
    }

    const chainArtifacts = JSON.parse(fs.readFileSync(chainArtifactsPath, "utf8"))

    // Find the TodoList contract
    const todoListContract = Object.values(chainArtifacts.contracts).find(
      (contract: any) => contract.contractName === "TodoList",
    ) as any

    if (!todoListContract) {
      console.error("TodoList contract not found in the deployment artifacts.")
      process.exit(1)
    }

    const contractAddress = todoListContract.address

    // Save the contract address to config/contract-address.json
    const configDir = path.join(__dirname, "..", "config")

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(configDir, "contract-address.json"),
      JSON.stringify({ TodoList: contractAddress }, null, 2),
    )

    console.log("Contract address extracted from Ignition deployment:", contractAddress)
    console.log("Address saved to config/contract-address.json")
    console.log("You can now start the frontend with: npm run dev")
  } catch (error) {
    console.error("Error extracting contract address:", error)
    process.exit(1)
  }
}

main()

