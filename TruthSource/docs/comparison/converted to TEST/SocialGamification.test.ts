// File: SocialGamification.test.ts
// Path: backend/services/premium/__tests__/SocialGamification.test.ts
// Purpose: Unit tests for the architecturally upgraded SocialGamification service.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — A comprehensive test suite for critical business logic.

import SocialGamification from '../SocialGamification';
import db from '@/services/db';
import redis from '@/services/redis';
import logger from '@/utils/logger';

// --- Mocks ---
// Mock all external dependencies for isolated unit testing
jest.mock('@/services/db');
jest.mock('@/services/redis');
jest.mock('@utils/logger');

// --- Test Suite ---
describe('SocialGamification Service', () => {

  // Create mock user objects for reuse
  const mockPremiumUser = { _id: 'user-premium-123', isPremium: true, role: 'user' };
  const mockOfficerUser = { _id: 'officer-789', isPremium: true, role: 'officer' };
  const mockNonPremiumUser = { _id: 'user-non-premium-456', isPremium: false, role: 'user' };

  beforeEach(() => {
    // Clear all mock history before each test
    jest.clearAllMocks();
  });

  describe('completeChallengeMission', () => {
    it('should award a badge if mission conditions are met', async () => {
      // Arrange: Mock DB calls and spy on the function we expect to be called
      (db.getUser as jest.Mock).mockResolvedValue(mockPremiumUser);
      const mockMission = {
        name: 'Strategic Bidder',
        badge: 'Strategic Pro',
        condition: (data: any) => data.wonAuction === true,
      };
      (db.getMissionByType as jest.Mock).mockResolvedValue(mockMission);
      const assignBadgeSpy = jest.spyOn(SocialGamification, 'assignBadge').mockResolvedValue({} as any);

      // Act
      const result = await SocialGamification.completeChallengeMission(mockPremiumUser._id, 'strategicBidder', { wonAuction: true });

      // Assert
      expect(result.status).toBe('completed');
      expect(result.badge).toBe('Strategic Pro');
      expect(assignBadgeSpy).toHaveBeenCalledWith(mockPremiumUser._id, 'Strategic Pro');
    });

    it('should not award a badge if mission conditions are not met', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockPremiumUser);
      const mockMission = { condition: (data: any) => data.wonAuction === true };
      (db.getMissionByType as jest.Mock).mockResolvedValue(mockMission);
      const assignBadgeSpy = jest.spyOn(SocialGamification, 'assignBadge');
      
      const result = await SocialGamification.completeChallengeMission(mockPremiumUser._id, 'strategicBidder', { wonAuction: false });

      expect(result.status).toBe('not_completed');
      expect(assignBadgeSpy).not.toHaveBeenCalled();
    });

    it('should throw an error for a non-premium user', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockNonPremiumUser);
      await expect(SocialGamification.completeChallengeMission(mockNonPremiumUser._id, 'any', {})).rejects.toThrow('Premium access required');
    });
  });

  describe('rateLimitSocialAction (with Redis)', () => {
    it('should allow an action if the count is below the limit', async () => {
      (redis.incr as jest.Mock).mockResolvedValue(1); // First action in the window

      const result = await SocialGamification.rateLimitSocialAction(mockPremiumUser._id, 'mission_submission');

      expect(result.status).toBe('allowed');
      expect(redis.expire).toHaveBeenCalledWith(expect.any(String), 3600); // Check that expire is set on the first hit
    });

    it('should deny an action if the count exceeds the limit', async () => {
      (redis.incr as jest.Mock).mockResolvedValue(6); // Limit is 5 for this action

      const result = await SocialGamification.rateLimitSocialAction(mockPremiumUser._id, 'mission_submission');

      expect(result.status).toBe('denied');
      expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Rate limit exceeded'));
    });
  });

  describe('flagContent', () => {
    it('should trigger a review when the flag threshold is met', async () => {
      const FLAG_THRESHOLD = 3;
      (db.addFlagToContent as jest.Mock).mockResolvedValue(FLAG_THRESHOLD);

      const result = await SocialGamification.flagContent(mockPremiumUser._id, 'content-123');

      expect(result.status).toBe('review_triggered');
      expect(db.updateContent).toHaveBeenCalledWith('content-123', { moderationStatus: 'pending_review' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('automatically flagged for review'));
    });
  });

  describe('moderateContent', () => {
    it('should allow an officer to moderate content', async () => {
        (db.getUser as jest.Mock).mockResolvedValue(mockOfficerUser);

        const result = await SocialGamification.moderateContent(mockOfficerUser._id, 'content-to-approve', 'approve');

        expect(result.status).toBe('moderated');
        expect(db.updateContent).toHaveBeenCalledWith('content-to-approve', { moderationStatus: 'approve', moderatedBy: mockOfficerUser._id });
    });

    it('should prevent a non-officer from moderating content', async () => {
        (db.getUser as jest.Mock).mockResolvedValue(mockPremiumUser);
        
        await expect(SocialGamification.moderateContent(mockPremiumUser._id, 'content-x', 'approve')).rejects.toThrow('Officer access required');
    });
  });
});