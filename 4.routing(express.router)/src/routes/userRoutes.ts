import express, { Router, Request, Response, NextFunction } from 'express';
import { getUsers } from '../controllers/userController';

const userRoutes: Router = express.Router();

userRoutes.get('/', (req: Request, res: Response, next: NextFunction) => {
    getUsers(req, res, next);
});

export default userRoutes;