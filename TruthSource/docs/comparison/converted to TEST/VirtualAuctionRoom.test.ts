/*
 * File: VirtualAuctionRoom.test.ts
 * Path: C:\CFH\backend\tests\services\premium\VirtualAuctionRoom.test.ts
 * Created: 2025-07-25 16:45 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the VirtualAuctionRoom service.
 * Artifact ID: test-svc-vr-auction-room
 * Version ID: test-svc-vr-auction-room-v1.0.0
 */

import { VirtualAuctionRoom } from '@services/premium/VirtualAuctionRoom';
import { WebSocketService } from '@services/websocket/WebSocketService';

// Mock dependencies
jest.mock('@utils/logger');
jest.mock('@services/websocket/WebSocketService');
jest.mock('@services/db', () => ({
    getUser: jest.fn(),
    getAuction: jest.fn(),
}));

describe('VirtualAuctionRoom Service', () => {
  const db = require('@services/db');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('joinRoom', () => {
    it('should throw an error if a non-premium user tries to join', async () => {
      db.getUser.mockResolvedValue({ isPremium: false });
      await expect(VirtualAuctionRoom.joinRoom('freeUser', 'auction123')).rejects.toThrow('Premium access required');
    });

    it('should allow a premium user to join a valid auction room', async () => {
      db.getUser.mockResolvedValue({ isPremium: true });
      db.getAuction.mockResolvedValue({ id: 'auction123' });
      const result = await VirtualAuctionRoom.joinRoom('premiumUser', 'auction123');
      expect(result).toEqual({ roomId: 'vr-room:auction123', status: 'joined' });
    });
  });

  describe('broadcastRoomUpdate', () => {
    it('should broadcast an update to the correct WebSocket room', async () => {
      db.getAuction.mockResolvedValue({ id: 'auction123' });
      const update = { newBid: 500 };
      await VirtualAuctionRoom.broadcastRoomUpdate('auction123', update);

      const mockWebSocketInstance = (WebSocketService as jest.Mock).mock.instances[0];
      expect(mockWebSocketInstance.emit).toHaveBeenCalledWith('vr-room:auction123', 'room-update', update);
    });
  });
});
