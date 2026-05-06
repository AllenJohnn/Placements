import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/generateTokens.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.slice(7);
    const payload = await verifyAccessToken(token);

    if (!payload) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Auth failed" });
  }
}
