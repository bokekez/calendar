import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/authApi";
import ScheduleEventDialog from "./EventDialog";

export default function TopNav() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
      navigate("/");
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        style={{
          backgroundColor: "#f8f9fa",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          borderRadius: "8px",
          padding: "0.5rem 1rem",
        }}
      >
        <Container>
          <Navbar.Brand
            className="fw-bold text-primary"
            style={{ fontSize: "1.2rem" }}
          >
            Speck
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/home" className="text-dark">
              Home
            </Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              style={{ border: "1px solid #ced4da" }}
              onClick={() => setShowDialog(true)}
            >
              Schedule
            </Button>
            <Button variant="outline-secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Container>
      </Navbar>

      <ScheduleEventDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onCreated={() => {
          /* optionally refresh calendar */
        }}
      />
    </>
  );
}
