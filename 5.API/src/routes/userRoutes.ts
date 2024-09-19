import express, { Router } from 'express';
import { getAllUsersController, getUserSessions, login, logout, logoutFromAllSessions, register } from '../controllers/userController';
import multer from 'multer';
import requireUser from '../middleware/auth';
import { deserializeUser } from '../middleware/deserializeUser';
const userRoutes: Router = express.Router();
const upload = multer({ dest: 'uploads/' });



// Public routes
// userRoutes.post('/register', upload.single('profileImage'), register);
userRoutes.post('/login', login);

userRoutes.post('/register', register);

// Protected routes (Require authentication)
// userRoutes.use(deserializeUser, requireUser);

userRoutes.get('/sessions',requireUser, deserializeUser, getUserSessions);
userRoutes.post('/logout', deserializeUser, requireUser, logout);
userRoutes.post('/logout-all', deserializeUser, requireUser, logoutFromAllSessions);
userRoutes.get('/users', deserializeUser, requireUser, getAllUsersController);




export default userRoutes;