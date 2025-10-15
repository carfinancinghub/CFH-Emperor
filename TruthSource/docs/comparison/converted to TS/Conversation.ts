// ----------------------------------------------------------------------
// File: Conversation.ts
// Path: backend/models/Conversation.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:16 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Mongoose schema for a messaging conversation.
// ----------------------------------------------------------------------
import { Schema, model, Document, Types } from 'mongoose';

export interface IConversation extends Document {
  listing: Types.ObjectId;
  participants: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
}, { timestamps: true });

export default model<IConversation>('Conversation', ConversationSchema);