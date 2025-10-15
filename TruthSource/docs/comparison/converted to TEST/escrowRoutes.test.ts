// ----------------------------------------------------------------------
// File: escrowRoutes.test.ts
// Path: backend/src/routes/__tests__/escrowRoutes.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 06:55 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import request from 'supertest';
import express from 'express';
import escrowRoutes from '../escrowRoutes';
import EscrowService from '@/services/EscrowService';

jest.mock('@/services/EscrowService');
const mockAuth = (req: any, res: any, next: any) => {
  req.user = { id: 'user-123', isPremium: true };
  next();
};

const app = express();
app.use(express.json());
app.use('/api/escrow', mockAuth, escrowRoutes);

describe('Escrow API Routes', () => {
  it('POST /sync should call the EscrowService with the user and actionData', async () => {
    const actionData = { type: 'DEPOSIT', amount: 500 };
    (EscrowService.syncAction as jest.Mock).mockResolvedValue({ success: true });

    await request(app).post('/api/escrow/sync').send({ actionData });

    expect(EscrowService.syncAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'user-123' }), // Verifies auth user is passed
      actionData
    );
  });
});