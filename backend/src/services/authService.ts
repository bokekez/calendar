import User from '../database/models/User';
import { fetchEventsFromGoogleWindow, upsertEventsToDb } from './googleCalendarService';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export async function upsertUserFromGoogle(profile: any, tokens: any) {
  const [user] = await User.upsert({
    id: profile.id,
    email: profile.email || '',
    name: profile.name || '',
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined
  }, { returning: true });
  return user;
}

export async function handlePostLogin(user: any) {
  try {
    const now = new Date();
    const from = new Date();
    from.setMonth(now.getMonth() - 6);
    from.setHours(0, 0, 0, 0);

    const to = new Date();
    to.setMonth(now.getMonth() + 6);
    to.setHours(23, 59, 59, 999);

    const events = await fetchEventsFromGoogleWindow(user, from.toISOString(), to.toISOString());
    await upsertEventsToDb(user.id, events);
  } catch (err) {
    console.error('Post-login calendar sync failed', err);
  }
}

export function createJwtAndSetCookie(userId: string, email: string, res: any) {
  const jwtSecret = process.env.JWT_SECRET || 'dev_secret_change_me';
  const token = jwt.sign({ sub: userId, email }, jwtSecret, { expiresIn: '7d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return token;
}
