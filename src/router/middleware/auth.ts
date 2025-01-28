import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface TokenData {
  userID: string;
  walletID: string;
}

export interface AuthSession {
  userID: string;
  walletID: string;
}

const SIGNING_SECRET = "WU4PjFqn3dGRUt7ht2iuIJvpSCYnCPuq";

export const verifyToken = async (token: string) => {
  const parseTokenPromise = new Promise((resolve, reject) => {
    jwt.verify(token, SIGNING_SECRET, function (err, decoded) {
      if (err) return reject(err);
      resolve(decoded);
    });
  });

  return (await parseTokenPromise) as TokenData;
};

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) return res.json({ err: "must provide session" });
  try {
    const data = await verifyToken(token);
    console.log("[session]", data);
    req.session = data;
    next();
  } catch (err) {
    console.log(err);
    return res.json({ err: "invalid session" });
  } // const token =
};
