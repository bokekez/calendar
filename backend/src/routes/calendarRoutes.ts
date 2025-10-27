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

    const params: any = {
      calendarId: 'primary',
      maxResults: 250,
      singleEvents: true,
      orderBy: 'startTime',
    };

    const from = typeof req.query.from === 'string' ? req.query.from : undefined;
    const to = typeof req.query.to === 'string' ? req.query.to : undefined;
    if (from) params.timeMin = from;
    if (to) params.timeMax = to;

    const resp = await calendar.events.list(params);
    res.json({ events: resp.data.items || [] });
  } catch (err) {
    console.error('Calendar fetch error', err);
    res.status(500).json({ error: 'Failed to fetch calendar events', detail: String(err) });
  }
});

export default router;
