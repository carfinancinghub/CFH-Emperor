// ----------------------------------------------------------------------
// File: messagingController.ts
// Path: backend/controllers/messagingController.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:19 PDT
// Version: 1.0.1 (Added WebSocket Error Handling)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Controller for messaging API requests.
// ----------------------------------------------------------------------
import { Request, Response } from 'express';
import MessagingService from '@/services/MessagingService';
import HistoryService from '@/services/HistoryService';

const messagingController = {
  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const { listingId } = req.body;
      const conversation = await MessagingService.findOrCreateConversation(listingId, req.user!.id);
      res.status(201).json(conversation);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const conversations = await MessagingService.getConversationsForUser(req.user!.id);
      await HistoryService.logAction(req.user!.id, 'VIEW_CONVERSATIONS', { count: conversations.length });
      res.status(200).json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  },

  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { conversationId } = req.params;
      const messages = await MessagingService.getMessagesInConversation(req.user!.id, conversationId);
      res.status(200).json(messages);
    } catch (error: any) {
      res.status(error.message.startsWith('Unauthorized') ? 403 : 500).json({ error: error.message });
    }
  },

  async postMessage(req: Request, res: Response): Promise<void> {
    const io = req.app.get('socketio');
    try {
      const { conversationId } = req.params;
      const { content } = req.body;
      const message = await MessagingService.sendMessage(req.user!.id, conversationId, content);
      
      try {
        io.to(`conversation_${conversationId}`).emit('new_message', message);
        await HistoryService.logAction(req.user!.id, 'SEND_MESSAGE', { conversationId });
      } catch (socketError: any) {
        await HistoryService.logAction(req.user!.id, 'SEND_MESSAGE_FAILED', { conversationId, error: socketError.message });
      }

      res.status(201).json(message);
    } catch (error: any) {
      res.status(error.message.startsWith('Unauthorized') ? 403 : 500).json({ error: error.message });
    }
  },
};

export default messagingController;