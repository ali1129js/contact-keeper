import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";

const payloadSchema = z.object({ sub: z.string().min(1) });

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function signToken(userId: string, secret: string, expiresIn: string): string {
  return jwt.sign({}, secret, { subject: userId, expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

export function requireAuth(secret: string): RequestHandler {
  return (req, res, next) => {
    const header = req.header("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
      res.status(401).json({ msg: "No token, authorization denied" });
      return;
    }
    try {
      const decoded = payloadSchema.parse(jwt.verify(token, secret));
      req.userId = decoded.sub;
      next();
    } catch {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
}
