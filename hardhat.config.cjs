require("@nomicfoundation/hardhat-toolbox"); // Or individual plugins
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.24", // For contracts that use 0.8.24
      },
      {
        version: "0.8.28", // For contracts that use ^0.8.28
      },
    ],
  },
  networks: {
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // ... other networks
  },
  etherscan: {
    apiKey: {
      baseSepolia: process.env.BASESCAN_API_KEY || "",
    },
  },
  sourcify: {
    enabled: true, // Needed by hardhat-verify >=1.1.0
  },
};