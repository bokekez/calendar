import express from "express";
import authRoutes from './authRoutes';
import requireAuth from '../middleware/authMiddleware';
import calendarRoutes from './calendarRoutes';

const router = express.Router();

router.use('/auth', authRoutes);

router.use('/calendar', requireAuth, calendarRoutes);

export default router;
