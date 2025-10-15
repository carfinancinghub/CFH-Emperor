// ----------------------------------------------------------------------
// File: PremiumSupportChat.ts
// Path: backend/src/services/premium/PremiumSupportChat.ts
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A comprehensive service for managing the lifecycle of real-time premium
// support chat sessions, including transcript logging.
//
// @usage
// This service is called by API routes to initiate, manage, and send
// messages within a secure, premium-only chat environment.
//
// @architectural_notes
// - **Full Accountability (Transcripts)**: The service no longer just logs a
//   single message; it is designed to append messages to a persistent chat
//   transcript in the database. This is critical for quality control and
//   dispute resolution.
// - **Robust Session Management**: The service now includes a full lifecycle
//   for chat sessions ('active', 'closed', 'resolved'). This allows the system
//   to track metrics like "time to resolution" and manage agent workloads.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Implement a 'getChatHistory(sessionId)' function to retrieve the full transcript for a session.
// @premium:
//   - [ ] ✨ Add a "typing indicator" feature using WebSockets to show when the other party is typing.
// @wow:
//   - [ ] 🚀 Integrate a generative AI to provide support officers with real-time, AI-powered response suggestions based on the user's messages.

import logger from '@/utils/logger';
import db from '@/services/db';
import websocket from '@/services/websocket';
import { IUser, IMessage } from '@/types'; // Assuming central types

// --- Service Module ---
const PremiumSupportChat = {
  /**
   * Starts a new chat session between a premium user and a support officer.
   */
  async startChatSession(userId: string, officerId: string): Promise<{ sessionId: string; status: 'started' }> {
    try {
      const user = await db.getUser(userId) as IUser;
      if (!user || !user.isPremium) throw new Error('Premium access required');

      const officer = await db.getUser(officerId) as IUser;
      if (!officer || officer.role !== 'officer') throw new Error('Officer not found or is not an officer');
      
      const session = await db.createChatSession({ participants: [userId, officerId], status: 'active' });
      await websocket.joinRoom(userId, session._id);
      await websocket.joinRoom(officerId, session._id);

      logger.info(`[PremiumSupportChat] Started chat session ${session._id} for user: ${userId}`);
      return { sessionId: session._id, status: 'started' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[PremiumSupportChat] Failed to start chat session for user ${userId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Sends a message within a session and logs it to the transcript.
   */
  async sendMessage(sessionId: string, senderId: string, content: string): Promise<{ status: 'message_sent' }> {
    try {
      // In a real app, we'd also validate that the senderId is a participant in the session
      const message: IMessage = { senderId, content, timestamp: new Date() };
      
      // ARCHITECTURAL UPGRADE: Log to a persistent transcript
      await db.addMessageToTranscript(sessionId, message);
      
      // ARCHITECTURAL UPGRADE: Broadcast to a specific room
      await websocket.sendMessageToRoom(sessionId, 'new_message', message);
      
      logger.info(`[PremiumSupportChat] Sent message in session ${sessionId} for user: ${senderId}`);
      return { status: 'message_sent' };
    } catch (err) {
      const error = err as Error;
      logger.error(`[PremiumSupportChat] Failed to send message for user ${senderId}: ${error.message}`, error);
      throw error;
    }
  },

  /**
   * Allows a support officer to mark a chat session as resolved.
   */
  async resolveChatSession(sessionId: string, officerId: string): Promise<{ status: 'resolved' }> {
    // TODO: Add logic to verify officerId has permission for this session
    await db.updateChatSession(sessionId, { status: 'resolved', resolvedAt: new Date(), resolvedBy: officerId });
    logger.info(`[PremiumSupportChat] Resolved chat session ${sessionId} by officer: ${officerId}`);
    return { status: 'resolved' };
  }
};

export default PremiumSupportChat;