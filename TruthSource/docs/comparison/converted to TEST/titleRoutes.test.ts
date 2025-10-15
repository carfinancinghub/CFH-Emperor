// File: titleRoutes.test.ts
// Path: backend/routes/__tests__/titleRoutes.test.ts

import request from 'supertest';
import express, { Application } from 'express';
import titleRouter from '../titleRoutes'; // The router we are testing

// --- Mocks ---
const mockSave = jest.fn();
const mockPopulate = jest.fn();

const mockTitle = {
  find: jest.fn(() => ({ populate: mockPopulate })),
  findById: jest.fn(),
};

// Mock the Mongoose model before it's used
jest.mock('../models/Title', () => ({
    __esModule: true,
    default: mockTitle,
}));

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
    __esModule: true,
    default: (req: any, res: any, next: any) => next(), // Simple pass-through
}));


// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/title', titleRouter);


describe('Title API Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/title', () => {
    it('should return 200 and all title records', async () => {
      const mockData = [{ _id: 'title1', status: 'clear' }];
      mockPopulate.mockResolvedValue(mockData);

      const res = await request(app).get('/api/title');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(mockTitle.find).toHaveBeenCalled();
      expect(mockPopulate).toHaveBeenCalledWith('carId');
      expect(mockPopulate).toHaveBeenCalledWith('buyerId');
    });

    it('should return 500 on a database error', async () => {
      mockPopulate.mockRejectedValue(new Error('DB Error'));
      const res = await request(app).get('/api/title');
      expect(res.status).toBe(500);
      expect(res.body.msg).toContain('Failed to load title records');
    });
  });

  describe('PATCH /api/title/:id/update', () => {
    it('should return 200 and the updated record on success', async () => {
        const mockRecord = { _id: 'title1', status: 'pending', save: mockSave };
        mockTitle.findById.mockResolvedValue(mockRecord);
        mockSave.mockResolvedValue({ ...mockRecord, status: 'clear' });

        const res = await request(app).patch('/api/title/title1/update').send({ status: 'clear' });

        expect(res.status).toBe(200);
        expect(res.body.msg).toBe('✅ Status updated');
        expect(mockTitle.findById).toHaveBeenCalledWith('title1');
        expect(mockRecord.save).toHaveBeenCalled();
        expect(mockRecord.status).toBe('clear'); // Check that the property was updated before save
    });

    it('should return 404 if the record is not found', async () => {
        mockTitle.findById.mockResolvedValue(null);
        const res = await request(app).patch('/api/title/not-found-id/update').send({ status: 'clear' });
        expect(res.status).toBe(404);
    });
  });
});