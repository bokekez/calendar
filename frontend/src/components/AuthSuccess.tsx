import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const email = params.get("email") || "";

  useEffect(() => {
    const t = setTimeout(() => navigate("/home"), 2000);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Alert variant="success" className="text-center">
        Logged in successfully{email ? `: ${email}` : ""} — redirecting...
      </Alert>
    </Container>
  );
}
