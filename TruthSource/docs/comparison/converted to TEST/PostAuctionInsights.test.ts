// ----------------------------------------------------------------------
// File: PostAuctionInsights.test.ts
// Path: backend/src/services/premium/__tests__/PostAuctionInsights.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the high-performance PostAuctionInsights service.
//
// @architectural_notes
// - **Testing Asynchronous & Cached Services**: This suite validates our key
//   architectural patterns. It tests the cache-hit/cache-miss logic to ensure
//   performance and verifies that long-running tasks are correctly offloaded
//   to our background job queue.
//
// ----------------------------------------------------------------------

import PostAuctionInsights from '../PostAuctionInsights';
import db from '@/services/db';
import aiService from '@/services/ai';
import redis from '@/services/redis';
import queue from '@/services/queue';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@/services/ai');
jest.mock('@/services/redis');
jest.mock('@/services/queue');
jest.mock('@utils/logger');


describe('PostAuctionInsights Service', () => {

  const mockPremiumUser = { _id: 'user-123', isPremium: true };

  beforeEach(() => {
    jest.clearAllMocks();
    (db.getUser as jest.Mock).mockResolvedValue(mockPremiumUser);
  });

  describe('analyzeAuction', () => {
    it('should return a cached report on a cache hit', async () => {
      const cachedReport = { performanceScore: 95 };
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedReport));

      const result = await PostAuctionInsights.analyzeAuction('user-123', 'auction-abc');

      expect(result).toEqual(cachedReport);
      expect(db.getAuction).not.toHaveBeenCalled(); // DB and AI should not be called
      expect(aiService.analyzeAuction).not.toHaveBeenCalled();
    });

    it('should generate a new report and set the cache on a cache miss', async () => {
      const newReport = { performanceScore: 99 };
      (redis.get as jest.Mock).mockResolvedValue(null); // Cache miss
      (db.getAuction as jest.Mock).mockResolvedValue({ _id: 'auction-abc' });
      (aiService.analyzeAuction as jest.Mock).mockResolvedValue(newReport);

      const result = await PostAuctionInsights.analyzeAuction('user-123', 'auction-abc');

      expect(result).toEqual(newReport);
      expect(db.getAuction).toHaveBeenCalledWith('auction-abc');
      expect(redis.set).toHaveBeenCalledWith('post-auction-insight:auction-abc', JSON.stringify(newReport));
    });
  });

  describe('startComparativeAnalysis (Asynchronous)', () => {
    it('should add a job to the queue and return a reportId', async () => {
      const mockJob = { id: 'job-id-5678' };
      (queue.add as jest.Mock).mockResolvedValue(mockJob);
      const auctionIds = ['auc-1', 'auc-2'];

      const result = await PostAuctionInsights.startComparativeAnalysis('user-123', auctionIds);

      expect(result.status).toBe('queued');
      expect(result.reportId).toBe('job-id-5678');
      expect(queue.add).toHaveBeenCalledWith(
        'comparative-analysis',
        { userId: 'user-123', auctionIds }
      );
    });
  });
});