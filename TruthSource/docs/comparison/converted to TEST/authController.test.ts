// ----------------------------------------------------------------------
// File: authController.test.ts
// Path: backend/src/controllers/__tests__/authController.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import request from 'supertest';
import express from 'express';
import * as authController from '../authController';
import { User } from '@/models/User';

jest.mock('@/models/User');

const app = express();
app.use(express.json());
app.post('/register', authController.registerUser);

describe('Auth Controller', () => {
  it('should return 400 if a user tries to register with an existing email', async () => {
    (User.findOne as jest.Mock).mockResolvedValue({ email: 'test@example.com' });
    
    const res = await request(app)
      .post('/register')
      .send({ username: 'test', email: 'test@example.com', password: 'password123', role: 'buyer' });
      
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Email already registered');
  });
});