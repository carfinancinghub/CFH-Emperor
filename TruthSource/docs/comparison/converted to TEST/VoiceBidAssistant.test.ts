/*
 * File: VoiceBidAssistant.test.ts
 * Path: C:\CFH\backend\tests\services\premium\VoiceBidAssistant.test.ts
 * Created: 2025-07-25 16:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the VoiceBidAssistant service.
 * Artifact ID: test-svc-voice-bid-assistant
 * Version ID: test-svc-voice-bid-assistant-v1.0.0
 */

import { VoiceBidAssistant } from '@services/premium/VoiceBidAssistant';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/db', () => ({
  getUser: jest.fn(),
  getAuction: jest.fn(),
}));
jest.mock('@services/voice', () => ({
  startSession: jest.fn(),
  getSession: jest.fn(),
  parseBidAmount: jest.fn(),
}));
jest.mock('@services/auction/AuctionManager', () => ({
  placeBid: jest.fn(),
}));

describe('VoiceBidAssistant Service', () => {
  const db = require('@services/db');
  const voice = require('@services/voice');
  const AuctionManager = require('@services/auction/AuctionManager');

  beforeEach(() => jest.clearAllMocks());

  describe('processVoiceBid', () => {
    it('should successfully process a valid voice bid', async () => {
      db.getUser.mockResolvedValue({ isPremium: true });
      voice.getSession.mockResolvedValue({ userId: 'premiumUser', auctionId: 'auction123' });
      voice.parseBidAmount.mockResolvedValue(750);
      AuctionManager.placeBid.mockResolvedValue({ status: 'success' });

      const result = await VoiceBidAssistant.processVoiceBid('premiumUser', 'session123', 'bid seven fifty');

      expect(result.status).toBe('bid placed');
      expect(result.amount).toBe(750);
      expect(AuctionManager.placeBid).toHaveBeenCalledWith('auction123', 'premiumUser', 750);
    });

    it('should throw an error for an invalid bid amount', async () => {
      db.getUser.mockResolvedValue({ isPremium: true });
      voice.getSession.mockResolvedValue({ userId: 'premiumUser', auctionId: 'auction123' });
      voice.parseBidAmount.mockResolvedValue(0); // Invalid amount

      await expect(VoiceBidAssistant.processVoiceBid('premiumUser', 'session123', 'bid zero')).rejects.toThrow('Invalid bid amount');
    });
  });
});
