import { verifyAccessToken } from "../utils/token.js";

export const requireAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const token = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    req.auth = verifyAccessToken(token);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};