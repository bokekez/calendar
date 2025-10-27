import React, { useEffect, useState } from 'react';
import TopNav from '../components/TopNav';
import { getCalendarEvents } from '../api/calendar';
import { getMe } from '../api/auth';
import { Container, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { CalendarEvent } from '../types/calendar';

function isoDate(d: Date) {
  return d.toISOString();
}

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setUserEmail(user?.email ?? null);

        const now = new Date();
        const prior = new Date(now);
        prior.setMonth(now.getMonth() - 6);
        const future = new Date(now);
        future.setMonth(now.getMonth() + 6);

        const res = await getCalendarEvents(isoDate(prior), isoDate(future));
        setEvents(res.events ?? []);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <TopNav />
      <Container>
        <h3 className="mb-3">Welcome{userEmail ? `, ${userEmail}` : ''}</h3>
        {loading ? (
          <div className="d-flex justify-content-center mt-4"><Spinner animation="border" /></div>
        ) : error ? (
          <div className="text-danger">Error: {error}</div>
        ) : events.length === 0 ? (
          <div>No events in the selected range.</div>
        ) : (
          <ListGroup>
            {events.map((e) => {
              const start = e.start?.dateTime || e.start?.date || '';
              const end = e.end?.dateTime || e.end?.date || '';
              return (
                <ListGroup.Item key={e.id}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{e.summary || '(no title)'}</div>
                      <div className="text-muted">{start} — {end}</div>
                    </div>
                    <Badge bg="secondary">Event</Badge>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        )}
      </Container>
    </>
  );
}
