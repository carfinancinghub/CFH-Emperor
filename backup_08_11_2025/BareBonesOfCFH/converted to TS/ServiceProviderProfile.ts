// ----------------------------------------------------------------------
// File: ServiceProviderProfile.ts
// Path: backend/models/ServiceProviderProfile.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:32 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A unified Mongoose schema for all service provider professional profiles.
// This single model is designed to be flexible enough to handle the unique
// data requirements of lenders, insurers, mechanics, and more.
//
// @architectural_notes
// - **Scalable & Unified**: Consolidates all provider types into one model,
//   preventing schema duplication and simplifying provider management.
// - **Flexible Data Structure**: The 'profileData' field uses a freeform
//   object to store type-specific information (e.g., Lender loan terms,
//   Insurer coverage types), making the system easily extensible.
//
// @todos
// - @free:
//   - [ ] Build the admin interface for the provider verification workflow.
// - @premium:
//   - [ ] ✨ Add a 'performanceMetrics' field to track bid win rates and other analytics for the provider dashboard.
// - @wow:
//   - [ ] 🚀 Integrate with third-party APIs to automate the 'PENDING_VERIFICATION' status check.
//
// ----------------------------------------------------------------------

import { Schema, model, Document } from 'mongoose';

export interface IServiceProviderProfile extends Document {
  user: Schema.Types.ObjectId;
  providerType: 'LENDER' | 'INSURER' | 'MECHANIC' | 'HAULER' | 'TITLE_AGENT';
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';
  businessName: string;
  licenseNumber?: string;
  profileData: object; // Flexible field for type-specific data
}

const ServiceProviderProfileSchema = new Schema<IServiceProviderProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  providerType: {
    type: String,
    enum: ['LENDER', 'INSURER', 'MECHANIC', 'HAULER', 'TITLE_AGENT'],
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED'],
    default: 'PENDING_VERIFICATION',
  },
  businessName: { type: String, required: true },
  licenseNumber: { type: String },
  profileData: { type: Object, default: {} },
}, { timestamps: true });

ServiceProviderProfileSchema.index({ providerType: 1, status: 1 });

export default model<IServiceProviderProfile>('ServiceProviderProfile', ServiceProviderProfileSchema);