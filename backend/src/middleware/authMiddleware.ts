import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../database/models/User";

export default async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization
      ? String(req.headers.authorization).replace(/^Bearer\s+/i, "")
      : null);
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const payload: any = jwt.verify(token, secret);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ error: "User not found" });
    (req as any).user = user;
    next();
  } catch (err) {
    console.error("Auth error", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}
