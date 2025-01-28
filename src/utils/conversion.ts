import { Alchemy } from "alchemy-sdk";

import { ethers } from "hardhat";
import { ENV } from "../env";
const ETH_TO_US = 3874.53;
const usdToWei = (usd: number) =>
  ethers.parseUnits((usd / ETH_TO_US).toFixed(18), 18).toString();

export const ethToUSD = async (eth: number) => {
  const alchemy = new Alchemy({ apiKey: "sGsaCogDLMtNtBFWqaE_amv19i2GKJUo" });

  // Define the symbols you want to fetch prices for.
  const symbols = ["SETH"];

  const result = await alchemy.prices.getTokenPriceBySymbol(symbols);
  const priceStr = result.data[0].prices[0].value;
  return Number(eth * parseFloat(priceStr));
};
