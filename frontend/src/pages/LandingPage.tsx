import { Container, Button } from "react-bootstrap";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Button onClick={handleLogin} size="lg">
        Authenticate with Google
      </Button>
    </Container>
  );
}
