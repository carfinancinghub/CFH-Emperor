// ----------------------------------------------------------------------
// File: uploadRoutes.test.ts
// Path: backend/src/routes/__tests__/uploadRoutes.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Integration tests for the single, secure file upload API gateway.
//
// @architectural_notes
// - **Testing a "Thin Controller"**: This suite validates that our route handler
//   correctly parses a multipart form, extracts the file and metadata, and
//   passes it to the 'PhotoService'. It tests the route's role as a secure
//   gateway and delegator.
//
// ----------------------------------------------------------------------

import request from 'supertest';
import express, { Application } from 'express';
import uploadRouter from '../uploadRoutes';
import PhotoService from '@/services/PhotoService';

// --- Mocks ---
jest.mock('@/services/PhotoService', () => ({
  uploadPhoto: jest.fn(),
}));

// Mock auth middleware
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'user-123' };
  next();
};

// --- Test Setup ---
const app: Application = express();
app.use(express.json());
// Apply mock auth to the router for testing
app.use('/api/uploads', (req, res, next) => mockAuth(req, res, next), uploadRouter);

describe('POST /api/uploads', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call PhotoService.uploadPhoto with the file and metadata', async () => {
    (PhotoService.uploadPhoto as jest.Mock).mockResolvedValue({ url: 'http://s3.url/image.jpg' });
    const buffer = Buffer.from('test file data');

    const res = await request(app)
      .post('/api/uploads')
      .attach('photo', buffer, 'test.jpg')
      .field('caption', 'A test photo')
      .field('type', 'inspection')
      .field('sourceId', 'insp-abc');
      
    expect(res.status).toBe(201);
    expect(PhotoService.uploadPhoto).toHaveBeenCalledTimes(1);
    
    // Check that the service was called with the correct, structured payload
    const servicePayload = (PhotoService.uploadPhoto as jest.Mock).mock.calls[0][0];
    expect(servicePayload.file.originalname).toBe('test.jpg');
    expect(servicePayload.caption).toBe('A test photo');
    expect(servicePayload.context.type).toBe('inspection');
    expect(servicePayload.uploadedBy.id).toBe('user-123');
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app)
      .post('/api/uploads')
      .field('caption', 'No photo here');
      
    expect(res.status).toBe(400);
    expect(PhotoService.uploadPhoto).not.toHaveBeenCalled();
  });
});