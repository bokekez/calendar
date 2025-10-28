export type CalendarDateTime = {
  dateTime?: string;
  date?: string;
};

export interface CalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: CalendarDateTime;
  end?: CalendarDateTime;
  htmlLink?: string;
}

export type CalendarGroups = {
  key: string;
  label: string;
  events: CalendarEvent[];
};

export type NewEventRequest = {
  summary: string;
  start: string; // ISO string
  end: string;   // ISO string
};