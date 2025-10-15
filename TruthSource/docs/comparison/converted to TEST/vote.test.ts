/*
 * File: vote.test.ts
 * Path: C:\CFH\backend\tests\routes\disputes\vote.test.ts
 * Created: 2025-07-25 16:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the dispute voting API route.
 * Artifact ID: test-route-dispute-vote
 * Version ID: test-route-dispute-vote-v1.0.0
 */

import request from 'supertest';
import express from 'express';
import voteRouter from '@routes/disputes/vote';

// Mock dependencies
const mockSave = jest.fn().mockResolvedValue(true);
jest.mock('@models/Dispute', () => ({
  findById: jest.fn(),
}));
jest.mock('@middleware/auth', () => (req: any, res: any, next: any) => {
  req.user = { id: 'judge2' };
  next();
});

const app = express();
app.use(express.json());
app.use('/api/disputes', voteRouter);

describe('Dispute Voting API Route', () => {
  const Dispute = require('@models/Dispute');

  beforeEach(() => jest.clearAllMocks());

  it('should allow an assigned judge to cast a valid vote', async () => {
    Dispute.findById.mockResolvedValue({
      assignedJudges: ['judge1', 'judge2'],
      votes: [{ arbitratorId: 'judge1' }],
      save: mockSave,
    });

    const res = await request(app)
      .post('/api/disputes/dispute123/vote')
      .send({ vote: 'yes', reason: 'Clear evidence' });

    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe('Vote submitted successfully');
    expect(mockSave).toHaveBeenCalled();
  });

  it('should prevent a judge from voting twice', async () => {
    Dispute.findById.mockResolvedValue({
      assignedJudges: ['judge1', 'judge2'],
      votes: [{ arbitratorId: 'judge2' }], // This judge has already voted
      save: mockSave,
    });

    const res = await request(app)
      .post('/api/disputes/dispute123/vote')
      .send({ vote: 'no' });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe('You have already voted');
  });

  it('should prevent an unassigned user from voting', async () => {
    Dispute.findById.mockResolvedValue({
      assignedJudges: ['judge1', 'judge3'], // Current user 'judge2' is not assigned
      votes: [],
      save: mockSave,
    });

    const res = await request(app)
      .post('/api/disputes/dispute123/vote')
      .send({ vote: 'yes' });

    expect(res.statusCode).toBe(403);
    expect(res.body.msg).toBe('You are not assigned to this dispute');
  });
});
