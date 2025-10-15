/*
 * File: watchlist.test.ts
 * Path: C:\CFH\backend\tests\routes\watchlist.test.ts
 * Created: 2025-07-25 16:15 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the watchlist API routes.
 * Artifact ID: test-route-watchlist
 * Version ID: test-route-watchlist-v1.0.0
 */

import request from 'supertest';
import express from 'express';
import watchlistRouter from '@routes/watchlist'; // Assuming alias is configured

// Mock the dependencies
jest.mock('@models/Watchlist', () => ({
  find: jest.fn().mockReturnThis(),
  populate: jest.fn().mockResolvedValue([{ listingId: '123', notes: 'Test' }]),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
  create: jest.fn().mockImplementation(data => Promise.resolve(data)),
}));
jest.mock('@middleware/authMiddleware', () => ({
  authenticateUser: (req: any, res: any, next: any) => {
    req.user = { _id: 'testUserId' };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use('/api/watchlist', watchlistRouter);

describe('Watchlist API Routes', () => {
  const Watchlist = require('@models/Watchlist');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for GET /
  it('should fetch all watchlist items for a user', async () => {
    const res = await request(app).get('/api/watchlist');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ listingId: '123', notes: 'Test' }]);
    expect(Watchlist.find).toHaveBeenCalledWith({ userId: 'testUserId' });
  });

  // Test for POST /
  it('should add an item to the watchlist', async () => {
    Watchlist.findOne.mockResolvedValue(null); // Item does not exist
    const newItem = { listingId: 'abc', notes: 'New item' };
    const res = await request(app).post('/api/watchlist').send(newItem);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(newItem);
    expect(Watchlist.create).toHaveBeenCalledWith({ ...newItem, userId: 'testUserId' });
  });

  it('should return 409 if item is already in watchlist', async () => {
    Watchlist.findOne.mockResolvedValue({ listingId: 'abc' }); // Item exists
    const newItem = { listingId: 'abc', notes: 'New item' };
    const res = await request(app).post('/api/watchlist').send(newItem);
    
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toBe('Already in watchlist.');
  });

  // Test for DELETE /:listingId
  it('should remove an item from the watchlist', async () => {
    Watchlist.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app).delete('/api/watchlist/abc');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Removed from watchlist.');
  });

  it('should return 404 if item to delete is not found', async () => {
    Watchlist.deleteOne.mockResolvedValue({ deletedCount: 0 });
    const res = await request(app).delete('/api/watchlist/notfound');
    
    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('Item not found in watchlist.');
  });
});
