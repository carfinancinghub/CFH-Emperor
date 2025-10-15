// ----------------------------------------------------------------------
// File: transportService.test.ts
// Path: backend/src/services/__tests__/transportService.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import transportService from '../transportService';
import Transport from '@/models/Transport';

jest.mock('@/models/Transport');

describe('transportService', () => {
  it('should throw an error if a hauler tries to update a job they do not own', async () => {
    const mockJob = { _id: 'job-123', haulerId: 'hauler-abc', save: jest.fn() };
    const mockUser = { id: 'hauler-xyz' }; // A different hauler
    (Transport.findById as jest.Mock).mockResolvedValue(mockJob);

    await expect(transportService.updateJobLocation(mockUser as any, 'job-123', {}))
      .rejects.toThrow('Forbidden: Not authorized to update this job.');
  });
});