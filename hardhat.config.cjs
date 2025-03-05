// import type { HardhatUserConfig } from "hardhat/config"
require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-ignition")

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
  },
  paths: {
    artifacts: "./artifacts",
  },
}

// export default config

