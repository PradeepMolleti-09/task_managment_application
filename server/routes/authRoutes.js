import express from 'express';
import { register, login, logout, sendVerifyOTP, verifyEmail, isAuthenticated, sendRestPasswordOTP, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();


router.post('/register', register); // router to handle user registration
router.post('/login', login); // router to handle user login
router.post('/logout', logout); // router to handle user logout
router.post('/sendVerifyOTP', userAuth, sendVerifyOTP); // router to send verification OTP
router.post('/verifyEmail', userAuth, verifyEmail); // router to verify email with OTP
router.get('/isAuth', userAuth, isAuthenticated); // router to check if user is authenticated
router.post('/sendRestPasswordOTP', sendRestPasswordOTP); // router to send reset password OTP
router.post('/resetPassword', resetPassword); // router to reset password

export default router;
