// src/controllers/userController.ts
import { Request, Response } from 'express';
import { deleteAllSessions, deleteSession, getAllUsers, getSessions, loginUser, registerUser } from '../services/userService';
import {AuthRequest} from "../middleware/deserializeUser";

// User Registration Endpoint
export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const profileImage = req.file?.path;

    try {
        const user = await registerUser(username, email, password, profileImage);
        res.status(201).json({ message: 'User registered successfully.', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error: any) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};

//User Login Endpoint
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
      const { token, user } = await loginUser(email, password);
      res.status(200).json({ message: 'Login successful', token, user });
  } catch (error: any) {
      res.status(401).json({ message: 'Login failed', error: error.message });
  }
};

//Get all Sessions : getting all active sessions for the current user:
export const getUserSessions = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = req.user.id;  // Ensure to attach the user in the deserialization process

  try {
      const sessions = await getSessions(userId);
      res.status(200).json(sessions);
  } catch (error: any) {
      res.status(500).json({ message: 'Could not retrieve sessions', error: error.message });
  }
};

// Delete Session (logout from a single device)
export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body; // The refresh token to invalidate

  try {
      await deleteSession(refreshToken);
      res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to log out', error });
  }
};

// Delete All Session (logout from all devices)

export const logoutFromAllSessions = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
      await deleteAllSessions(userId);
      res.status(200).json({ message: 'Logged out from all devices' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to log out from all devices', error });
  }
};


//Get All Users Endpoint
export const getAllUsersController = async (req: Request, res: Response) => {
  try {
      const users = await getAllUsers();
      res.status(200).json({ users });
  } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve users.', error });
  }
};
