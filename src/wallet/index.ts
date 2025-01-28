import { ethers } from "hardhat";
import { readJsonFile, writeJsonFile } from "../utils/fs";
import crypto from "crypto";
import { getAssets, getTransactions } from "./transactions";
import { ethToUSD } from "../utils/conversion";
import { ENV } from "../env";

const WALLET_STORE_PATH = "./wallet.json";

interface WalletData {
  address: string;
  privateKey: string;
  createdAt: number;
}
type GlobalWallet = Record<string, WalletData | null>;

export const getGlobalWallet = (): Promise<GlobalWallet> =>
  readJsonFile(WALLET_STORE_PATH);

/**
 * Wallet Instance
 * Interface with wallet to create & manage wallet keys locally
 * @param {string} name - wallet name
 */
const Wallet = {
  createWallet: async () => {
    const wallet = ethers.Wallet.createRandom();
    const walletID = crypto.randomUUID();
    const createdAt = Date.now();

    const newWallet: GlobalWallet = {
      [walletID]: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        createdAt,
      },
    };

    await writeJsonFile(WALLET_STORE_PATH, newWallet, true);

    return { id: walletID, createdAt, address: wallet.address };
  },

  fundWalletTransfer: async (amount: number, to: string) => {
    const signer = new ethers.Wallet(ENV.FUNDER_WALLET_KEY, ethers.provider);
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount.toString()),
    });
    return tx;
  },

  get: async (walletID: string) => {
    const gWallet = await getGlobalWallet();
    const walletData = gWallet[walletID];

    if (!walletData) throw new Error("wallet not found");

    return new ethers.Wallet(walletData.privateKey, ethers.provider);
  },

  /**
   * Returns Balance Given A wallet ID
   * @param walletID
   * @returns
   */
  balance: async (walletID: string) => {
    const gWallet = await getGlobalWallet();
    const userWallet = gWallet[walletID];

    if (!userWallet) throw new Error("wallet not found");
    const wei = await ethers.provider.getBalance(userWallet.address);
    const eth = parseFloat(ethers.formatEther(wei));
    const usd = await ethToUSD(eth);
    console.log("result", usd, eth);
    return { usd, eth };
  },

  /**
   *
   */
  transactions: async (walletID: string) => {
    const gWallet = await getGlobalWallet();
    const wallet = gWallet[walletID];

    if (!wallet) throw new Error("wallet not found");
    const txs = await getTransactions(wallet.address);

    return txs.map((tx) => ({
      amount: tx.value,
      to: tx.to,
      from: tx.from,
      hash: tx.hash,
      status: "Complete",
    }));
  },

  assets: {
    get: async (walletID: string) => {
      const gWallet = await getGlobalWallet();
      const wallet = gWallet[walletID];
      if (!wallet) throw new Error("wallet not found");
      return getAssets(wallet.address);
    },
  },
};
export default Wallet;
