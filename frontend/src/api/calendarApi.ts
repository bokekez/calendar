import { fetchWithCredentials } from "./authApi";
import { CalendarEvent, NewEventRequest } from "../types/calendar";
import { API } from "../constants/constants";

export type CalendarResponse = { events: CalendarEvent[] };

export async function getCalendarEvents(days: number = 7) {
  const params = new URLSearchParams({ days: String(days) });
  return fetchWithCredentials<CalendarResponse>(
    `${API}/calendar/events?${params.toString()}`,
  );
}

export async function refreshCalendarEvents(days: number) {
  const params = new URLSearchParams({ days: days.toString() });
  return fetchWithCredentials<CalendarResponse>(
    `${API}/calendar/refresh?${params.toString()}`,
    {
      method: "POST",
    },
  );
}

export async function createCalendarEvent(data: NewEventRequest) {
  const url = `${API}/calendar/create`;
  return fetchWithCredentials<{ event: CalendarEvent }>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
}
