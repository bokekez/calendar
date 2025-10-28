import { fetchWithCredentials } from './authApi';
import { CalendarEvent } from '../types/calendar';
import { API } from '../constants/constants';

export type CalendarResponse = { events: CalendarEvent[] };

export async function getCalendarEvents(days: number = 7) {
  const params = new URLSearchParams({ days: String(days) });
  return fetchWithCredentials<CalendarResponse>(`${API}/calendar/events?${params.toString()}`);
}

export async function refreshCalendarEvents(days: number) {
  const params = new URLSearchParams({ days: days.toString() });
  return fetchWithCredentials<CalendarResponse>(`${API}/calendar/refresh?${params.toString()}`, {
    method: 'POST',
  });
}
