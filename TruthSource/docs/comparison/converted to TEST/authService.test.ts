// ----------------------------------------------------------------------
// File: authService.test.ts
// Path: backend/src/services/__tests__/authService.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import authService from '../authService';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

jest.mock('@/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken', () => ({ sign: () => 'mock.jwt.token' }));

describe('authService', () => {
  it('should throw an error if a user tries to register with an existing email', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
    await expect(authService.register({ email: 'test@example.com', password: '123', role: 'buyer' })).rejects.toThrow('User already exists');
  });
  
  it('should throw an error for invalid login credentials', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    await expect(authService.login({ email: 'wrong@email.com', password: '123' })).rejects.toThrow('Invalid credentials');
  });
});