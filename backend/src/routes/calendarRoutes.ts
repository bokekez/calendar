import express from 'express';
import requireAuth from '../middleware/authMiddleware'; 
import { getEvents } from '../controllers/calendarController';

const router = express.Router();

router.get('/events', getEvents);

export default router;
