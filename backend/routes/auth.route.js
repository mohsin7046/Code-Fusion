import { Router } from 'express';
import { signup, login, me, logout,resetPassword,forgotPassword,updateProfile } from '../controller/auth.controller.js';
import protectedRoutes from '../middleware/auth.middleware.js';
import { emailVerifyOTP } from '../controller/auth.controller.js';
import { sendEmailOTP } from '../controller/auth.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout',logout);
router.post('/me',protectedRoutes,me);
router.post('/send-email-otp', sendEmailOTP);
router.post('/verify-email', emailVerifyOTP);
router.post('/reset-password',resetPassword);
router.post('/forgot-password',forgotPassword);
router.post('/update-profile',updateProfile);
export default router;
