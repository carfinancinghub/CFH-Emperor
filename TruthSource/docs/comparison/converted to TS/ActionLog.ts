// ----------------------------------------------------------------------
// File: ActionLog.ts
// Path: backend/models/ActionLog.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 08:49 PDT
// Version: 1.0.0 (Initial Model)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Mongoose model for storing user action logs for auditing and history.
//
// @architectural_notes
// - **Immutable Logs**: Designed as write-heavy, immutable records.
// - **Indexes**: Uses indexes on user and actionType for fast queries.
//
// @todos
// - @free:
//   - [ ] Add basic action filtering for user dashboards.
// - @premium:
//   - [ ] ✨ Support exportable logs for compliance reporting.
//
// ----------------------------------------------------------------------
import mongoose, { Schema, Document } from 'mongoose';

export interface IActionLog extends Document {
  user: string;
  actionType: string;
  details: object;
  createdAt: Date;
}

const ActionLogSchema = new Schema<IActionLog>({
  user: { type: String, required: true, index: true },
  actionType: { type: String, required: true, index: true },
  details: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IActionLog>('ActionLog', ActionLogSchema);