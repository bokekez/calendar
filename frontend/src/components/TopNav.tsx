import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/authApi';

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
    <Navbar expand="lg" style={{ backgroundColor: '#f8f9fa', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.5rem 1rem' }}>
      <Container>
        <Navbar.Brand className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>Speck</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/home" className="text-dark fw-semibold">Home</Nav.Link>
        </Nav>
        <Button 
          variant="light" 
          onClick={handleLogout} 
          style={{ border: '1px solid #ced4da', color: '#495057', fontWeight: 500 }}
        >
          Logout
        </Button>
      </Container>
    </Navbar>
  );
}
