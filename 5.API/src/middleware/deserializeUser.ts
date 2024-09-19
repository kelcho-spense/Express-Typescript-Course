// src/middleware/deserializeUser.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';

interface AuthRequest extends Request {
    user?: User;
}

export const deserializeUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as User;
        req.user = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export type { AuthRequest };