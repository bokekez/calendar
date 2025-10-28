import { fetchWithCredentials } from './auth';
import { CalendarEvent } from '../types/calendar';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export type CalendarResponse = { events: CalendarEvent[] };

export async function getCalendarEvents(days: number = 7) {
  const params = new URLSearchParams({ days: String(days) });
  return fetchWithCredentials<CalendarResponse>(`${API}/calendar/events?${params.toString()}`);
}
