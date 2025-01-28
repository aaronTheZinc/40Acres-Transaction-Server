import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import Wallet from "../wallet";
import { ethers } from "hardhat";
import TransactionRouter from "./transactions";
import { AuthMiddleware } from "./middleware/auth";

const router = Router();

router.use("/transactions", TransactionRouter);

/**
 * Create New Ethereum Wallet & Save Key For Future Transaction Signing
 * @param {string} session - Session ID
 */
router.post(
  "/create",

  (_, res) => {
    void Wallet.createWallet()
      .then((wallet) => res.status(200).json({ wallet }))
      .catch((_) =>
        res.status(500).json({ message: "wallet creation failed" }),
      );
  },
);

/**
 * Checks Balance Of Account
 */
router.get("/balance", AuthMiddleware, (req, res) => {
  void Wallet.balance(req.session.walletID)
    .then((balance) => res.json({ balance }))
    .catch((err) => {
      console.log(err);
      res.json({ err: "failed to retrieve balance" });
    });
});

router.post(
  "/fund",
  AuthMiddleware,
  validateRequest({
    body: z.object({
      amount: z.number(),
    }),
  }),
  async (req, res) => {
    const session = req.session;
    const wallet = await Wallet.get(session.walletID);
    void Wallet.fundWalletTransfer(req.body.amount, wallet.address)
      .then((tx) => res.json({ transaction: { hash: tx.hash } }))
      .catch((err: Error) => {
        res.json({ err: err.message });
      });
  },
);

const WalletRouter = router;
export default WalletRouter;
