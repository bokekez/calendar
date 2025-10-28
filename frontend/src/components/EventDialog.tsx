import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import dayjs from "dayjs";
import { createCalendarEvent } from "../api/calendarApi";
import { NewEventRequest } from "../types/calendar";

type Props = {
  show: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

export default function ScheduleEventDialog({
  show,
  onClose,
  onCreated,
}: Props) {
  const [summary, setSummary] = useState("");
  const [start, setStart] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
  const [end, setEnd] = useState(
    dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm"),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!summary) {
      setError("Please enter a title for the event.");
      return;
    }

    if (new Date(start) >= new Date(end)) {
      setError("End must be after start.");
      return;
    }

    const payload: NewEventRequest = {
      summary,
      start: new Date(start).toISOString(),
      end: new Date(end).toISOString(),
    };

    setLoading(true);
    try {
      await createCalendarEvent(payload);
      setSummary("");
      onCreated?.();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="text-danger mb-2">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start</Form.Label>
            <Form.Control
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>End</Form.Label>
            <Form.Control
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Scheduling…" : "Schedule"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
