import { fetchWithCredentials } from './auth';
import { CalendarEvent } from '../types/calendar';
const API = import.meta.env.VITE_API_URL;

export type CalendarResponse = { events: CalendarEvent[] };

export async function getCalendarEvents(fromIso: string, toIso: string) {
  const params = new URLSearchParams({ from: fromIso, to: toIso });
  return fetchWithCredentials<CalendarResponse>(`${API}/api/calendar/events?${params.toString()}`);
}