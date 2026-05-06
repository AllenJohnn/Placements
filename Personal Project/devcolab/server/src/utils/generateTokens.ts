import jwt from "jsonwebtoken";
import { config } from "@/config/env.js";
import { RefreshToken } from "@/models/RefreshToken.js";

export async function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, config.jwtAccessSecret, {
    expiresIn: config.jwtAccessExpires,
  });

  const refreshToken = jwt.sign({ userId }, config.jwtRefreshSecret, {
    expiresIn: config.jwtRefreshExpires,
  });

  // Store refresh token in DB
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshToken.create({
    userId,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

export async function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as { userId: string };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(token: string) {
  await RefreshToken.deleteOne({ token });
}
