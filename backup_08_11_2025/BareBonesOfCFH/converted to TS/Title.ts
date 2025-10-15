// ----------------------------------------------------------------------
// File: Title.ts
// Path: backend/models/Title.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 17:10 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Defines the Mongoose schema for the Title entity. This model acts as the
// "digital twin" for a vehicle's physical title document, tracking its
// verification status and transfer progress.
//
// @architectural_notes
// - **Verification-Centric**: The schema is built around the 'status' and
//   'verificationData' fields, supporting our premium automated title check feature.
// - **Agent Workflow Ready**: Includes an 'assignedAgent' field to integrate
//   directly with the Title Agent dashboard and workflow.
//
// @todos
// - @free:
//   - [ ] Implement the manual flow for sellers to upload proof of their title.
// - @premium:
//   - [ ] ✨ Build the integration with a real-time VIN/Title verification service (e.g., NMVTIS).
// - @wow:
//   - [ ] 🚀 Implement the 'Automated Lien Payoff' feature by adding lien holder information to this model.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface ITitle extends Document {
  listing: Schema.Types.ObjectId;
  vin: string;
  status: 'UNVERIFIED' | 'PENDING_VERIFICATION' | 'VERIFIED_CLEAN' | 'VERIFIED_BRANDED' | 'TRANSFER_IN_PROGRESS' | 'TRANSFER_COMPLETE';
  verificationData?: object; // To store data from NMVTIS or other services
  sellerProofOfTitleUrl?: string; // Link to a Photo
  assignedAgent?: Schema.Types.ObjectId;
}

const TitleSchema = new Schema<ITitle>({
  listing: { type: Schema.Types.ObjectId, ref: 'Listing', required: true, unique: true },
  vin: { type: String, required: true },
  status: {
    type: String,
    enum: ['UNVERIFIED', 'PENDING_VERIFICATION', 'VERIFIED_CLEAN', 'VERIFIED_BRANDED', 'TRANSFER_IN_PROGRESS', 'TRANSFER_COMPLETE'],
    default: 'UNVERIFIED',
  },
  verificationData: { type: Object },
  sellerProofOfTitleUrl: { type: String },
  assignedAgent: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default model<ITitle>('Title', TitleSchema);