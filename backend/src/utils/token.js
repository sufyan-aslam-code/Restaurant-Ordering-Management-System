import crypto from "crypto";

import jwt from "jsonwebtoken";

export const generateRandomToken = () =>
  crypto.randomBytes(32).toString("hex");

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const createAccessToken = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    }
  );

export const createRefreshToken = (payload) =>
  jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "14d",
    }
  );

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

export const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);