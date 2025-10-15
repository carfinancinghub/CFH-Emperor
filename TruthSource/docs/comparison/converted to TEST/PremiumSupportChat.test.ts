// ----------------------------------------------------------------------
// File: PremiumSupportChat.test.ts
// Path: backend/src/services/premium/__tests__/PremiumSupportChat.test.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Unit tests for the PremiumSupportChat service, verifying its role as an
// orchestrator for chat sessions.
//
// @architectural_notes
// - **Testing Service Orchestration**: This test suite's primary goal is to
//   verify that the service correctly calls its dependencies (the `db` and
//   `websocket` services) in the right order. We mock the dependencies to
//   test this orchestration logic in complete isolation.
//
// ----------------------------------------------------------------------

import PremiumSupportChat from '../PremiumSupportChat';
import db from '@/services/db';
import websocket from '@/services/websocket';

// --- Mocks ---
jest.mock('@/services/db');
jest.mock('@/services/websocket');
jest.mock('@utils/logger');


describe('PremiumSupportChat Service', () => {

  const mockPremiumUser = { _id: 'user-123', isPremium: true, role: 'user' };
  const mockOfficer = { _id: 'officer-789', isPremium: true, role: 'officer' };
  const mockNonPremiumUser = { _id: 'user-456', isPremium: false, role: 'user' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startChatSession', () => {
    it('should successfully start a session for a premium user with a valid officer', async () => {
      (db.getUser as jest.Mock)
        .mockResolvedValueOnce(mockPremiumUser)
        .mockResolvedValueOnce(mockOfficer);
      (db.createChatSession as jest.Mock).mockResolvedValue({ _id: 'session-abc' });

      const result = await PremiumSupportChat.startChatSession('user-123', 'officer-789');

      expect(result.status).toBe('started');
      expect(result.sessionId).toBe('session-abc');
      expect(db.createChatSession).toHaveBeenCalledWith({ participants: ['user-123', 'officer-789'], status: 'active' });
      expect(websocket.joinRoom).toHaveBeenCalledWith('user-123', 'session-abc');
      expect(websocket.joinRoom).toHaveBeenCalledWith('officer-789', 'session-abc');
    });

    it('should throw an error if the user is not premium', async () => {
      (db.getUser as jest.Mock).mockResolvedValue(mockNonPremiumUser);
      await expect(PremiumSupportChat.startChatSession('user-456', 'officer-789')).rejects.toThrow('Premium access required');
    });
  });

  describe('sendMessage', () => {
    it('should add the message to the transcript and broadcast it via websocket', async () => {
      const sessionId = 'session-abc';
      const senderId = 'user-123';
      const content = 'Hello, I need help.';

      await PremiumSupportChat.sendMessage(sessionId, senderId, content);

      expect(db.addMessageToTranscript).toHaveBeenCalledWith(sessionId, expect.objectContaining({ senderId, content }));
      expect(websocket.sendMessageToRoom).toHaveBeenCalledWith(sessionId, 'new_message', expect.objectContaining({ senderId, content }));
    });
  });
});