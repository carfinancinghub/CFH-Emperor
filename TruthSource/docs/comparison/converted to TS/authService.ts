// ----------------------------------------------------------------------
// File: authService.ts
// Path: backend/src/services/authService.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The central service for handling all user authentication logic, including
// registration, login, and password management.
//
// @architectural_notes
// - **Secure by Default**: This service uses 'bcrypt' for password hashing,
//   the non-negotiable industry standard for password security.
// - **Single Responsibility**: This service's only job is to manage authentication.
//   It is decoupled from the API routes that call it.
//
// // @todos
// - @free:
//   - [ ] Add a "password reset" flow that sends a secure, single-use link to the user's email.
// - @premium:
//   - [ ] ✨ Implement "Log in with Google" and other social SSO providers for easier onboarding.
// - @wow:
//   - [ ] 🚀 Implement a passwordless login option using WebAuthn (biometrics/hardware keys) for maximum security and convenience.
// 
// ----------------------------------------------------------------------

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import { IRegisterData, ILoginData } from '@/types';

const authService = {
  async register(data: IRegisterData) {
    const { email, password, role } = data;
    // In a real app, you would add logic to prevent self-assigning 'admin'
    if (await User.findOne({ email })) {
      throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ ...data, password: hashedPassword });
    await user.save();
    return this.generateAuthResponse(user);
  },

  async login(data: ILoginData) {
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return this.generateAuthResponse(user);
  },

  generateAuthResponse(user: any) {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return { token, role: user.role, userId: user._id };
  }
};

export default authService;