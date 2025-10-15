// ----------------------------------------------------------------------
// File: ServiceProviderProfile.ts
// Path: backend/models/ServiceProviderProfile.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 14:02 PDT
// Version: 1.0.3 (Aligned with Mini's Suggestions)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Mongoose model for service provider profiles, linked to users.
//
// @architectural_notes
// - **Linked Model**: Associates with User model for provider-specific data.
// - **Flexible**: Supports various provider types with reusable enums.
// - **Optimized**: Indexes on user, providerType, and status for fast queries.
// - **Auditable**: Logs status changes to HistoryService.
//
// @todos
// - @free:
//   - [x] Add basic provider profile model.
//   - [x] Update providerType enum with specific roles.
// - @premium:
//   - [ ] ✨ Add fields for provider performance metrics.
// - @wow:
//   - [ ] 🚀 Add AI-driven provider verification fields.
//   - [ ] 🚀 Explore Mongoose discriminators for type-specific schemas.
//
// ----------------------------------------------------------------------
import mongoose, { Schema, Document } from 'mongoose';
import HistoryService from '@/services/HistoryService';

// Reusable enums
export const PROVIDER_TYPES = [
  'LENDER',
  'INSURER',
  'MECHANIC',
  'HAULER',
  'TITLE_AGENT',
  'ESCROW',
  'STORAGE',
  'DETAILING',
  'TINTING',
  'CUSTOMIZATION',
] as const;
export type ProviderType = typeof PROVIDER_TYPES[number];

export const STATUS_TYPES = ['ACTIVE', 'SUSPENDED'] as const;
export type ProviderStatus = typeof STATUS_TYPES[number];

export interface IServiceProviderProfile extends Document {
  user: string;
  businessName: string;
  providerType: ProviderType;
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProviderProfileSchema = new Schema<IServiceProviderProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    businessName: {
      type: String,
      required: true,
      minlength: [2, 'Business name must be at least 2 characters'],
      maxlength: [100, 'Business name must be under 100 characters'],
    },
    providerType: {
      type: String,
      enum: PROVIDER_TYPES,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: STATUS_TYPES,
      default: 'SUSPENDED',
      index: true,
    },
  },
  { timestamps: true }
);

// Log status changes
ServiceProviderProfileSchema.post('save', function (doc, next) {
  if (this.isModified('status')) {
    HistoryService.logAction('system', 'UPDATE_PROVIDER_STATUS', {
      profileId: doc._id,
      userId: doc.user,
      newStatus: doc.status,
    }).catch(console.error);
  }
  next();
});

ServiceProviderProfileSchema.post('save', function (error, doc, next) {
  if (error.name === 'ValidationError') {
    const err = new Error('Invalid provider profile data');
    (err as any).status = 400;
    return next(err);
  }
  next(error);
});

export default mongoose.model<IServiceProviderProfile>('ServiceProviderProfile', ServiceProviderProfileSchema);