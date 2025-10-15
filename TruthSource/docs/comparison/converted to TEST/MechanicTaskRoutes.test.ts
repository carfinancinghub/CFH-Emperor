// ----------------------------------------------------------------------
// File: MechanicTaskRoutes.test.ts
// Path: backend/src/routes/mechanic/__tests__/MechanicTaskRoutes.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:28 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import request from 'supertest';
import express from 'express';
import mechanicTaskRoutes from '../MechanicTaskRoutes';
import MechanicService from '@/services/MechanicService';

jest.mock('@/services/MechanicService');

const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'mechanic-123', role: 'mechanic' };
  next();
};

const app = express();
app.use(express.json());
app.use('/api/mechanic/tasks', mockAuth, mechanicTaskRoutes);

describe('Mechanic Task API Routes', () => {
  it('PATCH /:taskId/complete should call the service with the authenticated user', async () => {
    (MechanicService.completeTask as jest.Mock).mockResolvedValue({ status: 'completed' });
    
    await request(app)
      .patch('/api/mechanic/tasks/task-abc/complete')
      .send({ notes: 'All done.' });
      
    expect(MechanicService.completeTask).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'mechanic-123' }), // Verifies auth user is passed
      'task-abc',
      { notes: 'All done.' }
    );
  });
});