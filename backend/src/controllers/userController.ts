import { Request, Response } from 'express';
import * as userService from '../services/userService';

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    res.json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}