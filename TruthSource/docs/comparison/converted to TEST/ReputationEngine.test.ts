// File: ReputationEngine.test.ts
// Path: backend/services/__tests__/ReputationEngine.test.ts
// Purpose: Unit tests for the configurable and auditable ReputationEngine service.

import ReputationEngine from '../ReputationEngine';
import User from '@/models/User';
import db from '@/services/db';
import logger from '@/utils/logger';

// --- Mocks ---
jest.mock('@/models/User');
jest.mock('@/services/db');
jest.mock('@utils/logger');

describe('ReputationEngine Service', () => {

  const mockUser = {
    _id: 'user-123',
    email: 'test@example.com',
    reputation: 100,
    save: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the findById to return our mock user by default
    (User.findById as jest.Mock).mockResolvedValue(mockUser);
  });

  it('should correctly increase a user\'s reputation for a positive action', async () => {
    const newReputation = await ReputationEngine.adjustReputation('user-123', 'win_case');

    // Rule for 'win_case' is +10
    expect(mockUser.reputation).toBe(110);
    expect(mockUser.save).toHaveBeenCalledTimes(1);
    expect(newReputation).toBe(110);
  });

  it('should correctly decrease a user\'s reputation for a negative action', async () => {
    const newReputation = await ReputationEngine.adjustReputation('user-123', 'lose_case');
    
    // Rule for 'lose_case' is -15
    expect(mockUser.reputation).toBe(85);
    expect(mockUser.save).toHaveBeenCalledTimes(1);
    expect(newReputation).toBe(85);
  });

  it('should create a detailed audit log for every reputation change', async () => {
    await ReputationEngine.adjustReputation('user-123', 'positive_feedback');

    expect(db.logReputationEvent).toHaveBeenCalledTimes(1);
    expect(db.logReputationEvent).toHaveBeenCalledWith({
      userId: 'user-123',
      action: 'positive_feedback',
      delta: 7, // Score change for this action
      oldReputation: 100,
      newReputation: 107,
      timestamp: expect.any(Date),
    });
  });

  it('should throw an error if the user is not found', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(ReputationEngine.adjustReputation('user-not-found', 'on_time')).rejects.toThrow('User not found');
  });

  it('should re-throw a database error and log it', async () => {
    const dbError = new Error('Save failed');
    mockUser.save.mockRejectedValue(dbError);

    await expect(ReputationEngine.adjustReputation('user-123', 'late')).rejects.toThrow('Save failed');
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to update reputation'), dbError);
  });
});