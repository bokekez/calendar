import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import MainPage from "../pages/MainPage";
import AuthSuccess from "../components/AuthSuccess";

export default function AppRoutes() {
  const query = new URLSearchParams(window.location.search);
  const email = query.get("email") || "";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/success" element={<AuthSuccess email={email} />} />
        <Route path="/home" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}
