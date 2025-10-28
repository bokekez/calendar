import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { loginWithGoogle } from '../api/authApi';

export default function LandingPage() {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={{ span: 6, offset: 3 }}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Speck</Card.Title>
              <Card.Text className="mb-4">
                Please authenticate with Google to connect your calendar and continue.
              </Card.Text>
              <Button onClick={loginWithGoogle} variant="primary" size="lg">
                Authenticate with Google
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
