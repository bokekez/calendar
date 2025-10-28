import { Request, Response } from "express";
import { createJwtAndSetCookie } from "../services/authService";
import { createOAuth2Client } from "../services/googleClient";
import { upsertUserFromGoogle, handlePostLogin } from "../services/authService";
import { google } from "googleapis";
import User from "../database/models/User";
import dotenv from "dotenv";
dotenv.config();

export async function redirectToGoogle(_req: Request, res: Response) {
  const url = (createOAuth2Client() as any).generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
  });
  res.redirect(url);
}

export async function googleCallback(req: Request, res: Response) {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send("Missing code");
  const oAuth2Client = createOAuth2Client();
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens.access_token)
      return res.status(400).send("Failed to get Google tokens");
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: oAuth2Client, version: "v2" });
    const userinfo = await oauth2.userinfo.get();
    const profile = userinfo.data;
    if (!profile || !profile.id)
      throw new Error("Failed to fetch user profile");
    const [user] = await User.upsert(
      {
        id: profile.id,
        email: profile.email || "",
        name: profile.name || "",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
      { returning: true },
    );
    await handlePostLogin(user as any);
    const token = createJwtAndSetCookie(profile.id, profile.email || "", res);
    const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
    if (req.query.json === "true") {
      return res.json({
        token,
        user: { id: profile.id, email: profile.email, name: profile.name },
      });
    }
    res.redirect(frontend + "/auth/success");
  } catch (err) {
    console.error("OAuth callback error", err);
    res.status(500).send("Authentication error");
  }
}

export async function me(req: Request, res: Response) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const jwt = require("jsonwebtoken");
    const jwtSecret = process.env.JWT_SECRET || "dev_secret_change_me";
    const payload = jwt.verify(token, jwtSecret) as any;
    res.json({ user: { id: payload.sub, email: payload.email } });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("token");
  res.json({ ok: true });
}
