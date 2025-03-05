"use client"

import { useWeb3 } from "@/hooks/use-web3"
import { Button } from "@/components/ui/button"
import { Wallet, AlertTriangle, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

export function ConnectWallet() {
  const { connect, connecting, error } = useWeb3()

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center"
      >
        <Wallet className="h-12 w-12 text-primary" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Connect to Blockchain</h2>
        <p className="text-muted-foreground">
          Connect to your local Hardhat node or MetaMask wallet to access your decentralized todo list
        </p>
      </div>

      {error && (
        <div className="flex items-center p-4 text-sm border rounded-lg border-destructive/50 bg-destructive/10 text-destructive">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={connect} disabled={connecting} size="lg">
          {connecting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect"
          )}
        </Button>
      </motion.div>

      <p className="text-xs text-muted-foreground">
        Make sure your Hardhat node is running locally at http://127.0.0.1:8545
      </p>
    </div>
  )
}

