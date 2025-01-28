import express, { type Request, type Response } from "express";

import Wallet from "../wallet";
import WalletRouter from "./wallet";
import AssetsRouter from "./assets";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/wallet", WalletRouter);
app.use("/assets", AssetsRouter);

export const startHost = (port: number) => {
  app.listen(port, () => console.log(`[App Listening On Port ${port}]`));
};
