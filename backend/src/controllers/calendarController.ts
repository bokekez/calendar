import { Request, Response } from 'express';
import { getEventsForUserWindow, createEventForUser, upsertEventsToDb } from '../services/googleCalendarService';
import { handlePostLogin } from '../services/authService';

export async function getEvents(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const daysParam = parseInt(String(req.query.days || '7'), 10);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 7;

  try {
    const events = await getEventsForUserWindow(user, days);
    return res.json({ events });
  } catch (err) {
    console.error('CalendarController.getEvents error', err);
    return res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
}

export async function refreshEvents(req: Request, res: Response) {
  const user = (req as any).user;
  const daysParam = parseInt(String(req.query.days || '7'), 10);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 7;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    await handlePostLogin(user);
    const events = await getEventsForUserWindow(user, days);
    return res.json({ events });
  } catch (err) {
    console.error('CalendarController.refreshEvents error', err);
    return res.status(500).json({ error: 'Failed to refresh events' });
  }
}

export async function createEvent(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });

  const { summary, start, end } = req.body as { summary?: string; start?: string; end?: string };
  if (!summary || !start || !end) return res.status(400).json({ error: 'summary, start and end are required' });

  try {
    const created = await createEventForUser(user, { summary, start, end });

    if (created) {
      const simple = {
        id: String(created.id),
        summary: created.summary ?? null,
        start: created.start?.dateTime ?? created.start?.date ?? null,
        end: created.end?.dateTime ?? created.end?.date ?? null,
        raw: created,
      };
      await upsertEventsToDb(user.id, [simple]);
      return res.json({ event: simple });
    }

    return res.status(500).json({ error: 'Failed to create event' });
  } catch (err) {
    console.error('CalendarController.createEvent error', err);
    return res.status(500).json({ error: 'Failed to create event' });
  }
}
