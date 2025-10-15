// File: transport.test.ts
// Path: backend/routes/__tests__/transport.test.ts

import request from 'supertest';
import express, { Application } from 'express';
import transportRouter from '../transport'; // The router we are testing

// --- Mocks ---
// Mock the Mongoose model
const mockTransport = {
  find: jest.fn(),
  findOneAndUpdate: jest.fn(),
  save: jest.fn().mockResolvedValue({}), // Mock the instance method
};
jest.mock('../models/Transport', () => ({ // Adjust path as needed
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    save: mockTransport.save,
  })),
  ...mockTransport, // Spread static methods
}));
// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
    __esModule: true,
    default: (req: any, res: any, next: any) => {
      req.user = { id: 'mock-hauler-id' }; // Attach mock user
      next();
    }
}));


// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.use('/api/transport', transportRouter);


describe('Transport API Routes', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/transport', () => {
    it('should return 200 and a list of transports for the hauler', async () => {
      const mockData = [{ _id: 'job1', status: 'In Transit' }];
      (mockTransport.find as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app).get('/api/transport');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(mockTransport.find).toHaveBeenCalledWith({ haulerId: 'mock-hauler-id' });
    });
  });

  describe('POST /api/transport/assign', () => {
    it('should return 201 and the new transport job on success', async () => {
      const jobData = { carId: 'car1', pickupLocation: 'A', deliveryLocation: 'B' };
      const newJob = { ...jobData, haulerId: 'mock-hauler-id' };
      (mockTransport.save as jest.Mock).mockResolvedValue(newJob);

      const res = await request(app).post('/api/transport/assign').send(jobData);

      expect(res.status).toBe(201);
      expect(res.body.transport).toMatchObject(jobData);
      expect(mockTransport.save).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/transport/:id/update', () => {
    it('should return 200 and the updated transport on success', async () => {
        const updatePayload = { status: 'Delivered' };
        const updatedJob = { _id: 'job1', status: 'Delivered' };
        (mockTransport.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedJob);

        const res = await request(app).patch('/api/transport/job1/update').send(updatePayload);

        expect(res.status).toBe(200);
        expect(res.body.transport).toEqual(updatedJob);
        expect(mockTransport.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'job1', haulerId: 'mock-hauler-id' },
            { $set: updatePayload },
            { new: true }
        );
    });

    it('should return 404 if the transport job is not found', async () => {
        (mockTransport.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
        const res = await request(app).patch('/api/transport/job-not-found/update').send({ status: 'Delivered' });
        expect(res.status).toBe(404);
    });
  });
});