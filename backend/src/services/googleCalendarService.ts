import { google, calendar_v3 } from "googleapis";
import { createOAuth2Client } from "./googleClient";
import UserCalendarEvent from "../database/models/UserCalendarEvent";
import { Op } from "sequelize";
import { SimpleEvent } from "../types/calendar";
import { IUser } from "../types/user";

function windowRangeDays(days: number) {
  const now = new Date();
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);
  const to = new Date(now);
  to.setDate(to.getDate() + days);
  to.setHours(23, 59, 59, 999);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    fromDate: from,
    toDate: to,
  };
}

export async function fetchEventsFromGoogleWindow(
  user: IUser,
  fromIso: string,
  toIso: string,
): Promise<SimpleEvent[]> {
  const oAuth2Client = createOAuth2Client();
  oAuth2Client.setCredentials({
    access_token: user.accessToken || undefined,
    refresh_token: user.refreshToken || undefined,
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const events: SimpleEvent[] = [];
  let pageToken: string | undefined = undefined;

  do {
    const listResponse: any = await calendar.events.list({
      calendarId: "primary",
      timeMin: fromIso,
      timeMax: toIso,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 250,
      pageToken,
    });

    const data = listResponse.data;
    const items = data.items ?? [];

    for (const it of items) {
      const startRaw = it.start?.dateTime ?? it.start?.date ?? null;
      const endRaw = it.end?.dateTime ?? it.end?.date ?? null;
      events.push({
        id: String(it.id),
        summary: it.summary ?? null,
        start: startRaw ? new Date(startRaw).toISOString() : null,
        end: endRaw ? new Date(endRaw).toISOString() : null,
        raw: it,
      });
    }

    pageToken = (data as any).nextPageToken ?? undefined;
  } while (pageToken);

  return events;
}

export async function upsertEventsToDb(userId: string, events: SimpleEvent[]) {
  if (!events || events.length === 0) return;

  const existingEvents = await UserCalendarEvent.findAll({
    where: { userId },
    attributes: ["googleEventId"],
  });
  const existingIds = new Set(existingEvents.map((e) => e.googleEventId));

  const newEvents = events.filter((e) => !existingIds.has(e.id));
  if (newEvents.length === 0) return;

  const rows = newEvents.map((e) => ({
    userId,
    googleEventId: e.id,
    summary: e.summary ?? null,
    startDateTime: e.start ? new Date(e.start) : null,
    endDateTime: e.end ? new Date(e.end) : null,
    raw: e.raw ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await UserCalendarEvent.bulkCreate(rows);
}

export async function getEventsForUserWindow(
  user: IUser,
  days: number,
): Promise<SimpleEvent[]> {
  const { from, to, fromDate, toDate } = windowRangeDays(days);

  const dbEvents = await UserCalendarEvent.findAll({
    where: {
      userId: user.id,
      startDateTime: { [Op.gte]: fromDate, [Op.lte]: toDate },
    },
    order: [["startDateTime", "ASC"]],
    attributes: ["googleEventId", "summary", "startDateTime", "endDateTime"],
  });

  if (dbEvents && dbEvents.length > 0) {
    return dbEvents.map((e) => ({
      id: e.getDataValue("googleEventId"),
      summary: e.getDataValue("summary"),
      start: e.getDataValue("startDateTime")
        ? new Date(e.getDataValue("startDateTime")).toISOString()
        : null,
      end: e.getDataValue("endDateTime")
        ? new Date(e.getDataValue("endDateTime")).toISOString()
        : null,
    }));
  }

  const googleEvents = await fetchEventsFromGoogleWindow(user, from, to);
  await upsertEventsToDb(user.id, googleEvents);
  return googleEvents;
}

export async function createEventForUser(
  user: IUser,
  payload: { summary: string; start: string; end: string },
) {
  const oAuth2Client = createOAuth2Client();
  oAuth2Client.setCredentials({
    access_token: user.accessToken || undefined,
    refresh_token: user.refreshToken || undefined,
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  const resource: any = {
    summary: payload.summary,
    start: { dateTime: payload.start },
    end: { dateTime: payload.end },
  };

  const resp = await calendar.events.insert({
    calendarId: "primary",
    requestBody: resource,
  });

  const event = resp.data;

  return event;
}
