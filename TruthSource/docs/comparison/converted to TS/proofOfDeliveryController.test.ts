// ----------------------------------------------------------------------
// File: proofOfDeliveryController.test.ts
// Path: backend/src/controllers/hauler/__tests__/proofOfDeliveryController.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the secure proof of delivery controller.
//
// @architectural_notes
// - **Security-First Testing**: The most critical test in this suite is the
//   authorization check. It verifies that a user cannot submit proof for a job
//   that does not belong to them, locking in our security standard.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import { submitProofOfDelivery } from '../proofOfDeliveryController';
import HaulerJob from '@/models/HaulerJob';

// --- Mocks ---
jest.mock('@/models/HaulerJob');

// Mock middleware to simulate an authenticated user
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'hauler-123' }; // The authenticated user
  next();
};

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
app.post('/api/hauler/jobs/:jobId/proof-of-delivery', mockAuth, submitProofOfDelivery);


describe('Proof of Delivery Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 403 Forbidden if the hauler does not own the job', async () => {
    const mockJob = { haulerId: 'hauler-456' }; // Job owned by a different hauler
    (HaulerJob.findById as jest.Mock).mockResolvedValue(mockJob);

    const res = await request(app).post('/api/hauler/jobs/job-abc/proof-of-delivery').send({});

    expect(res.status).toBe(403);
    expect(res.body.message).toContain('Forbidden');
  });

  it('should return 404 if the job is not found', async () => {
    (HaulerJob.findById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).post('/api/hauler/jobs/job-not-found/proof-of-delivery').send({});
    expect(res.status).toBe(404);
  });
  
  it('should update the job status and details on a successful submission', async () => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const mockJob = {
      haulerId: 'hauler-123', // Job owned by the authenticated user
      save: mockSave,
    };
    (HaulerJob.findById as jest.Mock).mockResolvedValue(mockJob);
    
    const proofData = {
      notes: 'Delivered successfully.',
      photoUrls: ['http://example.com/photo.jpg'],
    };

    const res = await request(app).post('/api/hauler/jobs/job-abc/proof-of-delivery').send(proofData);

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Delivery marked complete');
    expect(mockJob.status).toBe('Delivered');
    expect(mockJob.notes).toBe(proofData.notes);
    expect(mockJob.photos).toEqual(proofData.photoUrls);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });
});