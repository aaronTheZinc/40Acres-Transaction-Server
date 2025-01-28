import { ethers } from "hardhat";
import type { Wallet } from "ethers";
import type { TProperty } from "../schema/property";
import type { FractionalToken } from "../../typechain-types";

const ETH_TO_US = 3874.53;
const usdToWei = (usd: number) =>
  ethers.parseUnits((usd / ETH_TO_US).toString(), 18);

const Property = {
  /**
   * Tokenize Property
   * @param property
   * @param wallet
   * @returns contract address
   */
  tokenize: async (property: TProperty, wallet: Wallet) => {
    const FractionalPropertyNFT = await ethers.getContractFactory(
      "FractionalProperty",
      wallet,
    );

    const FractionalTokenContract = await ethers.getContractFactory(
      "FractionalToken",
      wallet,
    );

    const weiSharePrice = usdToWei(property.sharePrice);
    console.log("using wei", weiSharePrice);
    //deploy property nft
    const fractionalProperty = await FractionalPropertyNFT.deploy(
      property.contractName,
      property.symbol,
      weiSharePrice,
      property.shareCount,
    );

    await fractionalProperty.waitForDeployment();
    console.log(`[Property Minted]`, await fractionalProperty.getAddress());
    const propertyContractAddress = await fractionalProperty.getAddress();

    //Create Shares & Connect With Created Property Contract Address

    const fractionalToken = await FractionalTokenContract.deploy(
      `${property.contractName}-token`,
      `${property.symbol}-token`,
      property.shareCount,
      usdToWei(property.sharePrice),
      propertyContractAddress,
    );

    await fractionalToken.waitForDeployment();
    console.log(
      `[Property Shares Minted]`,
      await fractionalProperty.getAddress(),
    );

    const shareContractAddress = await fractionalToken.getAddress();
    // Get the contract address
    return { shareContractAddress, propertyContractAddress };
  },

  at: async (address: string) => {
    const contract = await ethers.getContractAt("FractionalProperty", address);
    return contract;
  },
  /**
   * Methods to interface with NFT Shares
   */
  shares: {
    purchase: async (tokenAddress: string, amount: number, wallet: Wallet) => {
      const contract = await ethers.getContractAt(
        "FractionalToken",
        tokenAddress,
        wallet,
      );

      const [currentSharePrice] = await contract.getShareDetails();
      const totalCost = currentSharePrice * BigInt(amount);

      const tx = await contract.purchaseShares(amount, { value: totalCost });
      await tx.wait();

      console.log("[Transaction]", tx.hash);
      return tx.hash;
    },

    /**
     * Sell n Number of Shares
     * @param tokenAddress
     * @param amount
     * @param wallet
     */
    sell: async (tokenAddress: string, amount: number, wallet: Wallet) => {
      const contract = (await ethers.getContractAt(
        "FractionalToken",
        tokenAddress,
        wallet,
      )) as unknown as FractionalToken;
      const tx = await contract.sellShares(amount);
      await tx.wait();
      console.log(`[Sell Fractional Share]`, tx.hash);
      return tx;
    },
  },
};

export default Property;
