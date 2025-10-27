import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

interface AuthSuccessProps {
  email: string;
}

export default function AuthSuccess({ email }: AuthSuccessProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Alert variant="success" className="text-center">
        Logged in successfully: {email}
      </Alert>
    </Container>
  );
}
