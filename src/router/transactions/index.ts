import { Router } from "express";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import Wallet from "../../wallet";
import { AuthMiddleware } from "../middleware/auth";
const router = Router();

router.get("/", AuthMiddleware, (req, res) => {
  const { walletID } = req.session;
  void Wallet.transactions(walletID)
    .then((transactions) => {
      console.log(transactions);
      res.json({ transactions });
    })
    .catch((err) => {
      if (err instanceof Error) {
        res.json({ err: err.message });
        return;
      }
      res.json({ err: "Unknown error" });
    });
});

export default router;
