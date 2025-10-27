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
