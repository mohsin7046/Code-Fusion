import { Router } from 'express';
import { signup, login, me, logout } from '../controller/auth.controller.js';
import protectedRoutes from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',logout);
router.post('/me',protectedRoutes,me);

export default router;
