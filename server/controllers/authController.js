import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { getTransporter } from '../config/nodeMailer.js';
import { Brute_Froce_Template, Email_Verify_template, Password_Rest_template } from '../config/emailTemplate.js';

/* ================= IDS CONFIG ================= */
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Required for SameSite: None 
            sameSite: 'None', // Required for cross-domain (Vercel -> Render)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const transporter = getTransporter();
        await transporter.sendMail({
            from: `"Auth System" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Auth System',
            html: '<h3>Welcome!</h3><p>Your account was created successfully.</p>'
        });

        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= LOGIN (WITH IDS) ================= */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        /* 🔐 IDS: Check account lock */
        if (user.lockUntil && user.lockUntil > Date.now()) {
            return res.status(423).json({
                success: false,
                message: 'Account temporarily locked due to multiple failed login attempts. Try again later.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        /* 🔐 IDS: Handle failed login */
        if (!isMatch) {
            user.loginAttempts += 1;

            if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_TIME;

                // 🚨 Security alert email
                const transporter = getTransporter();
                await transporter.sendMail({
                    from: `"Security Alert" <${process.env.EMAIL_USER}>`,
                    to: user.email,
                    subject: '⚠️ Brute Force Login Attempt Detected',
                    html: Brute_Froce_Template()
                });
            }

            await user.save();

            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        /* 🔐 IDS: Reset counters on success */
        user.loginAttempts = 0;
        user.lockUntil = 0;
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Required for SameSite: None 
            sameSite: 'None', // Required for cross-domain (Vercel -> Render)
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({ success: true, message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= SEND VERIFY OTP ================= */
export const sendVerifyOTP = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'Account already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyOTP = otp;
        user.verifyOTPExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = getTransporter();
        await transporter.sendMail({
            from: `"Auth System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Your Verification OTP',
            html: Email_Verify_template(otp)
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.verifyOTP !== String(otp) || Date.now() > user.verifyOTPExpiry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.verifyOTP = '';
        user.verifyOTPExpiry = 0;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= AUTH CHECK ================= */
export const isAuthenticated = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) return res.json({ success: false, message: 'Not logged in' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) return res.json({ success: false, message: 'Invalid session' });

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.json({ success: false, message: 'User not found' });

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: 'Session expired' });
    }
};

/* ================= SEND RESET OTP ================= */
export const sendRestPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOTP = otp;
        user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        const transporter = getTransporter();
        await transporter.sendMail({
            from: `"Auth System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset OTP',
            html: Password_Rest_template(otp)
        });

        res.status(200).json({ success: true, message: 'Password reset OTP sent' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.resetOTP !== String(otp) || Date.now() > user.resetOTPExpiry) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOTP = '';
        user.resetOTPExpiry = 0;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
