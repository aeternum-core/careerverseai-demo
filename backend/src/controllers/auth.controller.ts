import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository, StudentProfileRepository } from '../models';
import { EmailService } from '../services/email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'careerverse_cosmic_jwt_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'careerverse_cosmic_refresh_key_2026';

export class AuthController {
  // 1. REGISTER
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullName, role } = req.body;

      if (!email || !password || !fullName) {
        res.status(400).json({ error: 'Email, password, and full name are required.' });
        return;
      }

      // Check duplicate
      const existingUser = await UserRepository.findOne({ email });
      if (existingUser) {
        res.status(400).json({ error: 'User with this email already exists.' });
        return;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create User
      const user = await UserRepository.create({
        email,
        password: hashedPassword,
        role: role || 'student',
        otp,
        otpExpiry,
        isVerified: false
      });

      // Create profile link
      await StudentProfileRepository.create({
        userId: user._id,
        fullName,
        grade: 'Freshman',
        school: 'CareerVerse Academy',
        skills: [],
        interests: [],
        cgpa: 8.0,
        xp: 0,
        badges: ['Voyager Initiate'],
        streak: 1
      });

      // Dispatch verification OTP via Email or Demo Mode
      const emailResult = await EmailService.sendOTP(email, otp);

      res.status(201).json({
        message: emailResult.message,
        userId: user._id,
        email: user.email,
        emailSent: emailResult.sent,
        devOtp: emailResult.devOtp
      });
    } catch (error: any) {
      console.error("Register Error:", error);
      res.status(500).json({ error: 'Internal Server Error during registration.' });
    }
  }

  // 2. VERIFY OTP
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        res.status(400).json({ error: 'Email and OTP are required.' });
        return;
      }

      const user = await UserRepository.findOne({ email });
      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      // Check OTP matching and expiry
      if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
        res.status(400).json({ error: 'Invalid or expired OTP.' });
        return;
      }

      // Update verification status
      await UserRepository.findOneAndUpdate({ email }, { isVerified: true, otp: null, otpExpiry: null });

      res.status(200).json({ message: 'Email verified successfully. You can now login.' });
    } catch (error: any) {
      res.status(500).json({ error: 'Verification failed.' });
    }
  }

  // 3. LOGIN
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
        return;
      }

      const user = await UserRepository.findOne({ email });
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      // Check verified
      if (!user.isVerified) {
        res.status(403).json({ error: 'Email not verified. Please verify your OTP first.' });
        return;
      }

      // Check password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        res.status(401).json({ error: 'Invalid credentials.' });
        return;
      }

      // Fetch Profile
      const profile = await StudentProfileRepository.findOne({ userId: user._id });

      // Sign tokens
      const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
      const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      res.status(200).json({
        token,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: profile || {}
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Login failure.' });
    }
  }

  // 4. GOOGLE OAUTH MOCK
  static async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { token: googleToken, fullName, email } = req.body;

      if (!email || !fullName) {
        res.status(400).json({ error: 'Google authentication details incomplete.' });
        return;
      }

      let user = await UserRepository.findOne({ email });

      if (!user) {
        // Create user directly (since it is Google Auth, we mark verified)
        const passwordPlaceholder = await bcrypt.hash(Math.random().toString(36), 10);
        user = await UserRepository.create({
          email,
          password: passwordPlaceholder,
          role: 'student',
          isVerified: true
        });

        await StudentProfileRepository.create({
          userId: user._id,
          fullName,
          grade: 'Freshman',
          school: 'Google Authenticated',
          skills: [],
          interests: [],
          cgpa: 8.5,
          xp: 20,
          badges: ['Cosmic Explorer'],
          streak: 1
        });
      }

      const profile = await StudentProfileRepository.findOne({ userId: user._id });
      const token = jwt.sign({ userId: user._id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1d' });

      res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          profile: profile || {}
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Google login failed.' });
    }
  }
}
