// ----------------------------------------------------------------------
// File: lenderProfileRoutes.test.ts
// Path: backend/src/routes/lender/__tests__/lenderProfileRoutes.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the public-facing lender profile API endpoint.
//
// @architectural_notes
// - **Testing for Data Security (DTOs)**: The primary test here validates
//   our DTO pattern. It provides a full mock 'User' object (including a
//   password) and asserts that the final API response contains *only* the
//   public-safe fields defined in the DTO, proving our security layer works.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import lenderProfileRouter from '../lenderProfileRoutes';
import User from '@/models/User';
import LenderReputation from '@/models/LenderReputation';
import logger from '@/utils/logger';

// --- Mocks ---
jest.mock('@/models/User');
jest.mock('@/models/LenderReputation');
jest.mock('@utils/logger');


// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/lender', lenderProfileRouter);

describe('GET /api/lender/:lenderId/profile', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a public-safe DTO on a successful fetch', async () => {
    const mockLender = {
      _id: 'lender-123',
      username: 'Best Loans Inc.',
      email: 'secret@email.com', // This should be excluded by the DTO
      password: 'hashed_password', // This should DEFINITELY be excluded
      avatarUrl: 'http://image.url/avatar.png',
      createdAt: new Date().toISOString(),
      role: 'lender',
    };
    const mockReputation = {
      averageRating: 4.8,
      reviews: [{ reviewer: 'user-abc', comment: 'Great service!' }],
    };
    (User.findById as jest.Mock).mockReturnValue({ select: jest.fn().mockResolvedValue(mockLender) });
    (LenderReputation.findOne as jest.Mock).mockReturnValue({ populate: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(mockReputation) }) });

    const res = await request(app).get('/api/lender/lender-123/profile');
    
    expect(res.status).toBe(200);

    // Assert that the response matches the DTO structure, NOT the raw model
    expect(res.body.lender.id).toBe('lender-123');
    expect(res.body.lender.username).toBe('Best Loans Inc.');
    expect(res.body.reputation.averageRating).toBe(4.8);

    // Crucial security check: Assert that sensitive fields are NOT present
    expect(res.body.lender.email).toBeUndefined();
    expect(res.body.lender.password).toBeUndefined();
  });

  it('should return 404 if the lender is not found', async () => {
    (User.findById as jest.Mock).mockReturnValue({ select: jest.fn().mockResolvedValue(null) });
    const res = await request(app).get('/api/lender/not-found-id/profile');
    expect(res.status).toBe(404);
  });
});