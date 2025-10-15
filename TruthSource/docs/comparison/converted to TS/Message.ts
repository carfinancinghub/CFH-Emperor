// ----------------------------------------------------------------------
// File: Message.ts
// Path: backend/models/Message.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:17 PDT
// Version: 1.0.1 (Added Content Validation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Mongoose schema for an individual message.
// ----------------------------------------------------------------------
import { Schema, model, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  conversation: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxLength: 1000 },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default model<IMessage>('Message', MessageSchema);