// src/middleware/deserializeUser.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../models/User';
import { refreshAccessToken } from '../services/userService';

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
        // Detect token expiration
        if (error.name === 'TokenExpiredError') {
            const refreshToken = req.headers['x-refresh-token'];

            if (!refreshToken) {
                return res.status(401).json({ message: 'Token expired and no refresh token provided' });
            }

            // Attempt to refresh the token
            try {
                const newAccessToken = await refreshAccessToken(refreshToken as string);
                res.setHeader('x-access-token', newAccessToken);

                // Reattempt the original request after issuing the new token
                const decoded = jwt.verify(newAccessToken, config.jwtSecret) as User;
                req.user = decoded;
                next();
            } catch (refreshError) {
                return res.status(403).json({ message: 'Could not refresh token' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
};

export type { AuthRequest };
