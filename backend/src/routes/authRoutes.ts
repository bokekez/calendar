import express, { Request, Response } from 'express';
import { createOAuth2Client, getAuthUrl } from '../services/googleClient';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../database/models/User';

dotenv.config();

const router = express.Router();

function createJwtAndSetCookie(userId: string, email: string, res: Response) {
  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const token = jwt.sign({ sub: userId, email }, jwtSecret, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return token;
}

router.get('/google', (_req, res) => {
  const url = getAuthUrl();
  console.log('Redirecting to Google OAuth URL:', url);
  res.redirect(url);
});

router.get('/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send('Missing code');

  const oAuth2Client = createOAuth2Client();

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    if (!tokens.access_token || !tokens.refresh_token) {
      return res.status(400).send('Failed to get Google tokens');
    }

    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userinfo = await oauth2.userinfo.get();
    const profile = userinfo.data;

    if (!profile || !profile.id) throw new Error('Failed to fetch user profile');

    const [user] = await User.upsert(
      {
        id: profile.id,
        email: profile.email || '',
        name: profile.name || '',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
      { returning: true }
    );

    console.log(`User ${profile.email} logged in via Google`);

    const token = createJwtAndSetCookie(profile.id, profile.email || '', res);

    const frontend = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (req.query.json === 'true') {
      return res.json({ token, user: { id: profile.id, email: profile.email, name: profile.name } });
    }

    res.redirect(frontend + '/auth/success');
  } catch (err) {
    console.error('OAuth callback error', err);
    res.status(500).send('Authentication error');
  }
});

router.get('/me', async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const payload = jwt.verify(token, jwtSecret) as any;
    res.json({ user: { id: payload.sub, email: payload.email } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
