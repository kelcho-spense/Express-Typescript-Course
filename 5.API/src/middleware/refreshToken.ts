import { config } from '../config';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(403).json({ message: 'Token expired, login required' });

    try {
        const decoded = jwt.verify(refreshToken, config.jwtSecret) as { id: string; email: string };
        const newAccessToken = jwt.sign({ id: decoded.id, email: decoded.email }, config.jwtSecret, { expiresIn: '15m' });
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(403).json({ message: 'Invalid refresh token' });
    }
};
