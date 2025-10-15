// ----------------------------------------------------------------------
// File: GamificationService.test.ts
// Path: backend/src/services/__tests__/GamificationService.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import GamificationService from '../GamificationService';
import db from '@/services/db';

jest.mock('@/services/db');

describe('GamificationService', () => {
  it('should create a detailed audit log for a reputation change', async () => {
    const mockUser = { _id: 'user-123', reputation: 100, save: jest.fn() };
    (db.getUserById as jest.Mock).mockResolvedValue(mockUser);
    
    await GamificationService.adjustReputation('user-123', 'on_time');
    
    expect(db.logReputationEvent).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-123',
      action: 'on_time',
      delta: 5,
      newReputation: 105,
    }));
  });
});