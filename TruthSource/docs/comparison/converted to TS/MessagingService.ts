// ----------------------------------------------------------------------
// File: MessagingService.ts
// Path: backend/services/MessagingService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:18 PDT
// Version: 1.0.1 (Added Input Validation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Service for messaging business logic.
// ----------------------------------------------------------------------
import { z } from 'zod';
import Conversation from '@/models/Conversation';
import Message, { IMessage } from '@/models/Message';
import Listing from '@/models/Listing';
import { Types } from 'mongoose';

const MessageContentSchema = z.string().min(1).max(1000).trim();

const MessagingService = {
  async findOrCreateConversation(listingId: string, senderId: string) {
    const listing = await Listing.findById(listingId);
    if (!listing) throw new Error('Listing not found');
    const recipientId = listing.seller;

    if (senderId === recipientId.toString()) {
      throw new Error('You cannot start a conversation with yourself.');
    }

    let conversation = await Conversation.findOne({
      listing: listingId,
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        listing: listingId,
        participants: [senderId, recipientId],
      });
    }
    return conversation;
  },

  async getConversationsForUser(userId: string) {
    return Conversation.find({ participants: userId })
      .populate('participants', 'name')
      .populate('listing', 'make model year')
      .sort({ updatedAt: -1 });
  },

  async getMessagesInConversation(userId: string, conversationId: string) {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(new Types.ObjectId(userId))) {
      throw new Error('Unauthorized or conversation not found');
    }
    return Message.find({ conversation: conversationId })
      .populate('sender', 'name')
      .sort({ createdAt: 'asc' });
  },

  async sendMessage(userId: string, conversationId: string, content: string): Promise<IMessage> {
    MessageContentSchema.parse(content); // Validate input
    const conversation = await Conversation.findById(conversationId);
    if (!conversation || !conversation.participants.includes(new Types.ObjectId(userId))) {
      throw new Error('Unauthorized or conversation not found');
    }
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content,
    });
    
    conversation.updatedAt = new Date();
    await conversation.save();

    return message.populate('sender', 'name');
  },
};

export default MessagingService;