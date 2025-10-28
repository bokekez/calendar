import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Spinner, Card, ListGroup } from 'react-bootstrap';
import { getCalendarEvents } from '../api/calendar';
import { CalendarEvent } from '../types/calendar';
import dayjs from 'dayjs';

type Grouped = {
  key: string;
  label: string;
  events: CalendarEvent[];
};

function formatDateLabelISO(d: string) {
  return dayjs(d).format('ddd D MMM');
}

function weekStartIso(dateIso: string) {
  const d = dayjs(dateIso);
  const monday = d.startOf('week').add(1, 'day'); 
  return monday.format('YYYY-MM-DD');
}

export default function Calendar() {
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCalendarEvents(days);
        setEvents(res.events || []);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [days]);

  function groupEvents(): Grouped[] {
    if (days === 30) {
      const map = new Map<string, CalendarEvent[]>();
      for (const e of events) {
        if (!e.start) continue;
        const weekKey = weekStartIso(e.start);
        const arr = map.get(weekKey) ?? [];
        arr.push(e);
        map.set(weekKey, arr);
      }
      const groups: Grouped[] = Array.from(map.entries()).map(([k, ev]) => ({
        key: k,
        label: `Week of ${dayjs(k).format('D MMM YYYY')}`,
        events: ev.sort((a,b) => (a.start || '').localeCompare(b.start || '')),
      })).sort((a,b) => a.key.localeCompare(b.key));
      return groups;
    } else {
      const map = new Map<string, CalendarEvent[]>();
      for (const e of events) {
        if (!e.start) continue;
        const dayKey = dayjs(e.start).format('YYYY-MM-DD');
        const arr = map.get(dayKey) ?? [];
        arr.push(e);
        map.set(dayKey, arr);
      }
      const groups: Grouped[] = Array.from(map.entries()).map(([k, ev]) => ({
        key: k,
        label: formatDateLabelISO(k),
        events: ev.sort((a,b) => (a.start || '').localeCompare(b.start || '')),
      })).sort((a,b) => a.key.localeCompare(b.key));
      return groups;
    }
  }

  const groups = groupEvents();

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col xs="auto">
          <Form.Select value={String(days)} onChange={(e) => setDays(parseInt(e.target.value, 10))}>
            <option value="1">1 day</option>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="d-flex justify-content-center"><Spinner animation="border" /></div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : groups.length === 0 ? (
        <div>No events found.</div>
      ) : (
        groups.map(g => (
          <Card className="mb-3" key={g.key}>
            <Card.Header>{g.label}</Card.Header>
            <ListGroup variant="flush">
              {g.events.map(ev => {
                const start = ev.start ? dayjs(ev.start).format('YYYY-MM-DD HH:mm') : '';
                const end = ev.end ? dayjs(ev.end).format('HH:mm') : '';
                return (
                  <ListGroup.Item key={ev.id} className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-bold">{ev.summary || '(no title)'}</div>
                      <div className="text-muted">{start}{end ? ` — ${end}` : ''}</div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        ))
      )}
    </Container>
  );
}
