import express from "express";
import {
  redirectToGoogle,
  googleCallback,
  me,
  logout,
} from "../controllers/authController";
const router = express.Router();

router.get("/google", redirectToGoogle);
router.get("/google/callback", googleCallback);
router.get("/me", me);
router.post("/logout", logout);

export default router;
