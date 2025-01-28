import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
//  import "@nomiclabs/hardhat-ethers";

const API_KEY = "sGsaCogDLMtNtBFWqaE_amv19i2GKJUo";

const config: HardhatUserConfig = {
  solidity: "0.8.28",

  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${API_KEY}`, // Replace with your Infura or Alchemy URL
      chainId: 11155111, // Sepolia's chain ID
    },
  },
};

export default config;
