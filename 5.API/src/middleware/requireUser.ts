import { Response, NextFunction } from 'express';
import { AuthRequest } from './deserializeUser'

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized: No user found' });
    next();
};

