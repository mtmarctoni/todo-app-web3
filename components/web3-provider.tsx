"use client"

import { createContext, useEffect, useState, type ReactNode } from "react"
import { ethers } from "ethers"
import TodoContract from "@/artifacts/contracts/TodoList.sol/TodoList.json"
import { ThemeProvider } from "next-themes"
import contractAddress from "@/config/contract-address.json"

interface Web3ContextType {
  provider: ethers.Provider | null
  signer: ethers.Signer | null
  contract: ethers.Contract | null
  address: string
  connected: boolean
  connecting: boolean
  error: string | null
  connect: () => Promise<void>
}

export const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  contract: null,
  address: "",
  connected: false,
  connecting: false,
  error: null,
  connect: async () => {},
})

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [provider, setProvider] = useState<ethers.Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [address, setAddress] = useState("")
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Use the contract address from the config file
  const todoListAddress = contractAddress.TodoList

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const initializeProvider = async () => {
      try {
        let web3Provider: ethers.Provider
        let web3Signer: ethers.Signer

        // Check if we're in a browser and if window.ethereum is available
        if (typeof window !== "undefined" && window.ethereum) {
          // Use MetaMask provider if available
          web3Provider = new ethers.BrowserProvider(window.ethereum)
          web3Signer = await web3Provider.getSigner()
          const accounts = await web3Provider.listAccounts()

          if (accounts.length > 0) {
            setAddress(accounts[0].address)
          }
        } else {
          // Use local Hardhat node for development
          web3Provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
          web3Signer = await web3Provider.getSigner()
          setAddress(await web3Signer.getAddress())
        }

        // Create contract instance
        const todoContract = new ethers.Contract(todoListAddress, TodoContract.abi, web3Signer)

        setProvider(web3Provider)
        setSigner(web3Signer)
        setContract(todoContract)
        setConnected(true)
        setError(null)
      } catch (err) {
        console.error("Error initializing web3:", err)
        setError("Failed to connect to the blockchain. Make sure Hardhat node is running.")
      }
    }

    initializeProvider()
  }, [isClient, todoListAddress])

  // Handle account changes if using MetaMask
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setConnected(false)
          setAddress("")
          setSigner(null)
          setContract(null)
        } else {
          try {
            const address = accounts[0]
            setAddress(address)

            if (provider) {
              const signer = await (provider as ethers.BrowserProvider).getSigner()
              setSigner(signer)

              const contract = new ethers.Contract(todoListAddress, TodoContract.abi, signer)
              setContract(contract)
              setConnected(true)
              setError(null)
            }
          } catch (err) {
            console.error("Error handling account change:", err)
            setError("Failed to update wallet connection")
          }
        }
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      }
    }
  }, [provider, todoListAddress])

  const connect = async () => {
    if (!provider) {
      setError("No provider available. Make sure Hardhat node is running.")
      return
    }

    setConnecting(true)
    setError(null)

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // If MetaMask is available, request accounts
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

        if (accounts.length > 0) {
          const address = accounts[0]
          setAddress(address)

          const signer = await (provider as ethers.BrowserProvider).getSigner()
          setSigner(signer)

          const contract = new ethers.Contract(todoListAddress, TodoContract.abi, signer)
          setContract(contract)
          setConnected(true)
        }
      } else {
        // For local development without MetaMask
        const localProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")
        const signer = await localProvider.getSigner()
        const address = await signer.getAddress()

        setProvider(localProvider)
        setSigner(signer)
        setAddress(address)

        const contract = new ethers.Contract(todoListAddress, TodoContract.abi, signer)
        setContract(contract)
        setConnected(true)
      }
    } catch (err: any) {
      console.error("Error connecting:", err)
      setError(err.message || "Failed to connect")
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        contract,
        address,
        connected,
        connecting,
        error,
        connect,
      }}
    >
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </Web3Context.Provider>
  )
}

