// ----------------------------------------------------------------------
// File: RealTimePredictor.test.ts
// Path: backend/services/premium/__tests__/RealTimePredictor.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the high-performance, premium AI prediction service.
//
// ----------------------------------------------------------------------

import RealTimePredictor from '../RealTimePredictor';
import db from '@/services/db';
import ai from '@/services/ai';
import redis from '@/services/redis';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@/services/ai');
jest.mock('@/services/redis');

describe('RealTimePredictor Service', () => {

  const userContext = { userId: 'user-123', isPremium: true, budget: 50000 };
  const auctionId = 'auction-abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a cached prediction on a cache hit', async () => {
    const cachedPrediction = { amount: 51000, confidence: 0.8 };
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedPrediction));

    const result = await RealTimePredictor.predictNextBid(auctionId, userContext);

    expect(result).toEqual(cachedPrediction);
    expect(db.getAuction).not.toHaveBeenCalled(); // DB should not be called
    expect(ai.predictNextBid).not.toHaveBeenCalled(); // AI model should not be called
  });

  it('should fetch from the AI model on a cache miss and then set the cache', async () => {
    const livePrediction = { amount: 52000, confidence: 0.9 };
    (redis.get as jest.Mock).mockResolvedValue(null); // Cache miss
    (db.getAuction as jest.Mock).mockResolvedValue({ bids: [], timeRemaining: 300 });
    (ai.predictNextBid as jest.Mock).mockResolvedValue(livePrediction);

    const result = await RealTimePredictor.predictNextBid(auctionId, userContext);

    expect(result).toEqual(livePrediction);
    expect(db.getAuction).toHaveBeenCalledWith(auctionId);
    expect(ai.predictNextBid).toHaveBeenCalled();
    expect(redis.set).toHaveBeenCalledWith(
      `prediction:auction:${auctionId}`,
      JSON.stringify(livePrediction),
      { EX: 10 }
    );
  });
  
  it('should generate a personalized suggestion when the prediction exceeds the user\'s budget', async () => {
    const highPrediction = { amount: 55000, confidence: 0.85 };
    // Spy on and mock the internal call to predictNextBid
    jest.spyOn(RealTimePredictor, 'predictNextBid').mockResolvedValue(highPrediction);
    
    const result = await RealTimePredictor.getBiddingSuggestions(auctionId, userContext);

    expect(result.suggestions[0]).toContain('exceeds your set budget');
  });
});