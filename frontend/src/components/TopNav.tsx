import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/auth';

export default function TopNav() {
  const navigate = useNavigate();

   const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
      navigate('/');
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand>Speck</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
        </Nav>
        <Button variant="outline-secondary" onClick={handleLogout}>Logout</Button>
      </Container>
    </Navbar>
  );
}
