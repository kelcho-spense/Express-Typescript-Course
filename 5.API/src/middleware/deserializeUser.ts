// src/middleware/deserializeUser.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { refreshAccessToken } from '../services/userService';
import { User } from '../models/User';

 interface AuthRequest extends Request {
    user?: User;
  }

export const deserializeUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as User;
        req.user = decoded;
        next();
    } catch (error: any) {
        // Handle expired access token by using the refresh token
        const refreshToken = req.cookies['refreshToken'];

        if (refreshToken) {
            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                next();
            } catch (refreshError: any) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
        } else {
            return res.status(403).json({ message: 'Token expired, login required' });
        }
    }
};

export type { AuthRequest };