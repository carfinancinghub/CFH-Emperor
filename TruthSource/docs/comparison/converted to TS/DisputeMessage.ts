// ----------------------------------------------------------------------
// File: DisputeMessage.ts
// Path: backend/models/DisputeMessage.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:51 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for a single message within a Dispute case.
// It supports text and photo attachments for evidence.
//
// @architectural_notes
// - **Evidence-Ready**: The 'attachments' field directly integrates with our
//   Unified Photo Management System by referencing the 'Photo' model.
// - **Moderator Support**: The 'isInternalNote' flag allows admins to have
//   private conversations within the dispute thread, hidden from the parties.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IDisputeMessage extends Document {
  dispute: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  message: string;
  attachments: Schema.Types.ObjectId[];
  isInternalNote: boolean;
}

const DisputeMessageSchema = new Schema<IDisputeMessage>({
  dispute: { type: Schema.Types.ObjectId, ref: 'Dispute', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  attachments: [{ type: Schema.Types.ObjectId, ref: 'Photo' }],
  isInternalNote: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IDisputeMessage>('DisputeMessage', DisputeMessageSchema);