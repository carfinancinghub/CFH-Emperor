// ----------------------------------------------------------------------
// File: authController.ts
// Path: backend/src/controllers/authController.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The central controller for handling all user authentication logic, including
// registration and login.
//
// @architectural_notes
// - **Secure by Default**: This controller uses 'bcrypt' for password hashing,
//   the non-negotiable industry standard for password security.
// - **Single Responsibility**: This controller's only job is to manage authentication.
//   It is decoupled from any other part of the application.
//
// @todos
// - @free:
//   - [ ] Add a "password reset" flow that sends a secure, single-use link to the user's email.
// - @premium:
//   - [ ] ✨ Implement "Log in with Google" and other social SSO providers for easier onboarding.
// - @wow:
//   - [ ] 🚀 Implement a passwordless login option using WebAuthn (biometrics/hardware keys) for maximum security and convenience.
//
// ----------------------------------------------------------------------

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { IRegisterData, ILoginData } from '@/types';
import logger from '@/utils/logger';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body as IRegisterData;

    if (!email || !password || !role || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashed,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role, username: newUser.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered',
      token,
      userId: newUser._id,
      role: newUser.role,
      username: newUser.username,
    });
  } catch (err) {
    logger.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as ILoginData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
      username: user.username,
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};