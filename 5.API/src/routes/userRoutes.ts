import express, { Router } from 'express';
import { getAllUsersController, getUserSessions, login, logout, logoutFromAllSessions, register } from '../controllers/userController';
import multer from 'multer'; 
import requireUser from '../middleware/auth';
import { deserializeUser } from '../middleware/deserializeUser';
const userRoutes: Router = express.Router();
const upload = multer({ dest: 'uploads/' });


userRoutes.post('/register', upload.single('profileImage'), register);

// Public routes
userRoutes.post('/register', register);
userRoutes.post('/login', login);

// Protected routes (Require authentication)
userRoutes.use(deserializeUser, requireUser);

userRoutes.get('/sessions', getUserSessions);
userRoutes.post('/logout', logout);
userRoutes.post('/logout-all', logoutFromAllSessions);
userRoutes.get('/users', getAllUsersController);




export default userRoutes;