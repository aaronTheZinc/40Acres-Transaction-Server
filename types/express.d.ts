import type { Request } from "express";
import type { TokenData } from "../src/router/middleware/auth";

declare global {
  namespace Express {
    interface Request {
      session: TokenData;
    }
  }
}
