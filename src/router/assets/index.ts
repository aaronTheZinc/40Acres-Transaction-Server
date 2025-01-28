import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { PropertySchema } from "../../schema/property";
import Wallet from "../../wallet";
import { z } from "zod";
import Property from "../../assets";
import { type AuthSession, AuthMiddleware } from "../middleware/auth";
const router = Router();

router.use("/", AuthMiddleware);

router.post(
  "/tokenize",
  validateRequest({
    body: z.object({
      property: PropertySchema,
    }),
  }),
  async (req, res) => {
    const { property } = req.body;
    const { walletID } = req.session as AuthSession;
    const signer = await Wallet.get(walletID);

    void Property.tokenize(property, signer)
      .then((addresses) => res.json({ property: { ...addresses } }))
      .catch((err) => {
        if (err instanceof Error) {
          res.json({ err: err.message });
          return;
        }
        res.json({ err: "unknown error" });
        return;
      });
  },
);

router.post(
  "/purchase",
  validateRequest({
    body: z.object({
      tokenAddress: z.string(),
      amount: z.number().positive(),
    }),
  }),

  AuthMiddleware,
  async (req, res) => {
    const { walletID } = req.session;
    const { tokenAddress, amount } = req.body;
    const signer = await Wallet.get(walletID);
    Property.shares
      .purchase(tokenAddress, amount, signer)
      .then((txHash) => res.json({ transaction: txHash }))
      .catch((err) => {
        if (err instanceof Error) {
          res.json({ err: err.message });
          return;
        }
        res.json({ err: "unknown error" });
        return;
      });
  },
);

router.post(
  "/sell",
  validateRequest({
    body: z.object({
      amount: z.number().int().positive(),
      tokenAddress: z.string(),
    }),
  }),
  AuthMiddleware,
  async (req, res) => {
    const { walletID } = req.session;
    const { amount, tokenAddress } = req.body;
    const signer = await Wallet.get(walletID);
    void Property.shares.sell(tokenAddress, amount, signer).then((tx) =>
      res.json({
        transaction: {
          hash: tx.hash,
          gas: tx.gasPrice,
        },
      }),
    );

    // req.
  },
);

router.get("/get", AuthMiddleware, async (req, res) => {
  const { walletID } = req.session;
  try {
    const assets = await Wallet.assets.get(walletID);
    console.log("assets: ", assets);
    return res.json({ assets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "unknown error" });
  }
});

export default router;
