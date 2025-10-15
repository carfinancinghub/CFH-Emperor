// ----------------------------------------------------------------------
// File: Dispute.ts
// Path: backend/models/Dispute.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 4:51 PM PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Dispute entity. This model is the
// definitive record for a conflict resolution case between two parties.
//
// @architectural_notes
// - **State-Driven**: The 'status' enum provides a clear state machine for
//   managing the dispute resolution workflow from start to finish.
// - **Auditable**: Contains fields for both the complainant/defendant and the
//   final resolution, creating a clear audit trail.
//
// @todos
// - @free:
//   - [ ] Add a database index to 'status' to quickly query for all open disputes.
// - @premium:
//   - [ ] ✨ Add an 'escalationLevel' field for multi-tiered support.
// - @wow:
//   - [ ] 🚀 Implement a 'sentimentScore' field, updated by our AI Mediator, to track the tone of the dispute.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IDispute extends Document {
  auction: Schema.Types.ObjectId;
  complainant: Schema.Types.ObjectId;
  defendant: Schema.Types.ObjectId;
  status: 'OPEN' | 'AWAITING_RESPONSE' | 'IN_MEDIATION' | 'RESOLVED' | 'CLOSED';
  reason: string;
  resolution?: string;
  moderator?: Schema.Types.ObjectId;
}

const DisputeSchema = new Schema<IDispute>({
  auction: { type: Schema.Types.ObjectId, ref: 'Auction', required: true },
  complainant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  defendant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['OPEN', 'AWAITING_RESPONSE', 'IN_MEDIATION', 'RESOLVED', 'CLOSED'],
    default: 'OPEN',
  },
  reason: { type: String, required: true },
  resolution: { type: String },
  moderator: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default model<IDispute>('Dispute', DisputeSchema);