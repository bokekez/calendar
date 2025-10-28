import express from "express";
import requireAuth from "../middleware/authMiddleware";
import {
  getEvents,
  refreshEvents,
  createEvent,
} from "../controllers/calendarController";

const router = express.Router();

router.get("/events", requireAuth, getEvents);
router.post("/refresh", requireAuth, refreshEvents);
router.post("/create", requireAuth, createEvent);

export default router;
