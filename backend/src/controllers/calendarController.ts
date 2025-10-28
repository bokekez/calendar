import { Request, Response } from "express";
import { getEventsForUserWindow } from "../services/googleCalendarService";
import { handlePostLogin } from "../services/authService";

export async function getEvents(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const daysParam = parseInt(String(req.query.days || "7"), 10);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? daysParam : 7;

  try {
    const events = await getEventsForUserWindow(user, days);
    return res.json({ events });
  } catch (err) {
    console.error("CalendarController.getEvents error", err);
    return res.status(500).json({ error: "Failed to fetch calendar events" });
  }
}

export async function refreshEvents(req: Request, res: Response) {
  const user = req.user;
  const days = parseInt(req.query.days as string) || 7;
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  try {
    await handlePostLogin(user);

    const events = await getEventsForUserWindow(user, days);
    res.json({ events });
  } catch (err) {
    console.error("CalendarController.refreshEvents error", err);
    res.status(500).json({ error: "Failed to refresh events" });
  }
}
