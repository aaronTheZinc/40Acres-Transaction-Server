import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  ALCHEMY_KEY: process.env.ALCHEMY_KEY!,
  FUNDER_WALLET_KEY: process.env.FUNDER_WALLET_KEY!,
};
