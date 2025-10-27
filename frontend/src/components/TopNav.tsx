import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function TopNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:4000/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) {
      navigate('/');
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/home">Speck</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
          <Nav.Link href="/calendar">Calendar</Nav.Link>
        </Nav>
        <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
      </Container>
    </Navbar>
  );
}
