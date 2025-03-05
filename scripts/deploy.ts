import { ethers } from "hardhat"
import fs from "fs"
import path from "path"

async function main() {
  // Get the network from Hardhat
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)

  // Deploy the TodoList contract
  const TodoList = await ethers.getContractFactory("TodoList")
  const todoList = await TodoList.deploy()

  await todoList.waitForDeployment()

  const contractAddress = await todoList.getAddress()
  console.log("TodoList deployed to:", contractAddress)

  // Save the contract address to a file for the frontend to use
  const contractsDir = path.join(__dirname, "..", "config")

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ TodoList: contractAddress }, null, 2),
  )
  
  console.log("Contract address saved to config/contract-address.json")
  console.log("You can now start the frontend with: npm run dev")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

