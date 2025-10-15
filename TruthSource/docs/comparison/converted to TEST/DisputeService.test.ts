// ----------------------------------------------------------------------
// File: DisputeService.test.ts
// Path: backend/src/services/__tests__/DisputeService.test.ts
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:48 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import DisputeService from '../DisputeService';
import Dispute from '@/models/Dispute';

jest.mock('@/models/Dispute');

describe('DisputeService', () => {
  it('should prevent a user from voting if they are not an assigned judge', async () => {
    const mockDispute = { _id: 'dispute-123', judges: ['judge-abc'], status: 'Voting', votes: [] };
    const mockUser = { id: 'user-xyz' }; // Not a judge for this case
    (Dispute.findById as jest.Mock).mockResolvedValue(mockDispute);

    await expect(DisputeService.addVote(mockUser as any, 'dispute-123', 'for_initiator'))
      .rejects.toThrow('Forbidden: User is not a judge for this dispute.');
  });
});