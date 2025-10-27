import express from 'express';
import { google } from 'googleapis';
import { createOAuth2Client } from '../services/googleClient';
import requireAuth from '../middleware/authMiddleware';

const router = express.Router();

router.get('/events', requireAuth, async (req, res) => {
const user = req.user!;
try {
const oAuth2Client = createOAuth2Client();
oAuth2Client.setCredentials({
access_token: user.accessToken || undefined,
refresh_token: user.refreshToken || undefined,
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
const resp = await calendar.events.list({ calendarId: 'primary', maxResults: 50, singleEvents: true, orderBy: 'startTime' });
res.json({ events: resp.data.items || [] });
} catch (err) {
console.error('Calendar fetch error', err);
res.status(500).json({ error: 'Failed to fetch calendar events' });
}
});


export default router;