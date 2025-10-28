import express from "express";
import requireAuth from "../middleware/authMiddleware";
import { getEvents, refreshEvents } from "../controllers/calendarController";

const router = express.Router();

router.get("/events", requireAuth, getEvents);
router.post("/refresh", requireAuth, refreshEvents);

export default router;
