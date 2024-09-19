import express from 'express';
import { register, login, getUserSessions, logout, logoutFromAllSessions, getAllUsersController } from '../controllers/userController';
import { requireUser } from '../middleware/requireUser';
import { deserializeUser } from '../middleware/deserializeUser';
import { refreshToken } from '../middleware/refreshToken';

const userRoutes = express.Router();

// Public routes
userRoutes.post('/register', register);
userRoutes.post('/login', login);

// Protected routes (Authentication required)
userRoutes.use(deserializeUser); // Validates access token on all protected routes
userRoutes.get('/sessions', requireUser, getUserSessions);
userRoutes.post('/logout', requireUser, logout);
userRoutes.post('/logout-all', requireUser, logoutFromAllSessions);
userRoutes.get('/users', requireUser, getAllUsersController);

// Token refresh route
userRoutes.post('/refresh-token', refreshToken);

export default userRoutes;
