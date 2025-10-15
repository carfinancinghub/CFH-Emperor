// ----------------------------------------------------------------------
// File: ListingService.ts
// Path: backend/services/ListingService.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 08:33 PDT
// Version: 2.2.1 (Tiered Logic, Publishing & Full Lifecycle)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, production-ready service for managing the entire seller
// listing lifecycle, with tiered features, publishing, and audit logging.
//
// @architectural_notes
// - **Tiered Feature Gating**: Checks user subscription tier to enforce premium feature limits, such as photo uploads.
// - **Lifecycle Management**: Explicit state transitions (e.g., DRAFT to ACTIVE) with ownership checks.
// - **Robust & Scalable**: Pagination, custom error handling, and audit logging for performance and traceability.
// - **Integration**: Ties into PhotoService, WebSocketService, and HistoryService for cohesive platform behavior.
//
// @todos
// - @premium:
//   - [x] ✨ Enforce photo limits based on subscription tier.
// - @wow:
//   - [ ] 🚀 Replace placeholder AI pricing logic with AIService.suggestPrice integration.
//
// ----------------------------------------------------------------------
import Listing, { IListing } from '@/models/Listing';
import { ListingSchema } from '@/validation/ListingSchema';
import GamificationService from '@/services/GamificationService';
import UserService from '@/services/UserService';
import WebSocketService from '@/services/WebSocketService';
import PhotoService from '@/services/PhotoService'; // Added for photo validation
import HistoryService from '@/services/HistoryService'; // Added for audit logging
import { z } from 'zod';

// Input type for stricter typing
type ListingInput = z.infer<typeof ListingSchema>;

// Custom Error class for better API responses
class ListingError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
  }
}

const ListingService = {
  /**
   * Creates a new, validated listing with tiered photo limits and logs events.
   * @throws {ListingError} If photo limit exceeded or validation fails.
   */
  async createListing(userId: string, listingData: ListingInput): Promise<IListing> {
    // (Premium) Tiered Feature Check
    const user = await UserService.getUserById(userId);
    const maxPhotos = user.subscription === 'PREMIUM' ? 20 : 5;
    if (listingData.photos?.length > maxPhotos) {
      throw new ListingError(`Your current plan allows up to ${maxPhotos} photos. Upgrade to Premium for more.`, 403);
    }
    // Validate photo IDs
    if (listingData.photos?.length) {
      await PhotoService.validatePhotoIds(listingData.photos);
    }
    const validatedData = ListingSchema.parse(listingData);
    const newListing = new Listing({ ...validatedData, seller: userId, status: 'DRAFT' });
    await newListing.save();
    GamificationService.logEvent(userId, 'CREATE_LISTING').catch(console.error);
    WebSocketService.emit('new_listing', { listingId: newListing._id, sellerId: userId });
    HistoryService.logAction(userId, 'CREATE_LISTING', { listingId: newListing._id }).catch(console.error);
    return newListing;
  },

  /**
   * Retrieves a single listing, with AI-powered enhancements for Wow++ users.
   * @todo Replace placeholder AI logic with AIService.suggestPrice.
   * @throws {ListingError} If listing not found.
   */
  async getEnhancedListing(listingId: string, userId: string): Promise<IListing & { suggestedPrice?: number }> {
    const listing = await Listing.findById(listingId).populate('seller', 'name profile.avatar');
    if (!listing) throw new ListingError('Listing not found.', 404);
    const user = await UserService.getUserById(userId);
    if (user.subscription === 'WOW') {
      const suggestedPrice = listing.price * 1.05; // Placeholder AI logic
      return { ...listing.toObject(), suggestedPrice };
    }
    return listing.toObject();
  },

  /**
   * Retrieves all listings by a seller with pagination.
   * @throws {ListingError} If no listings found (optional).
   */
  async getListingsBySeller(sellerId: string, options: { limit?: number; page?: number } = {}): Promise<IListing[]> {
    const { limit = 10, page = 1 } = options;
    return await Listing.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('seller', 'name profile.avatar');
  },

  /**
   * Transitions a listing from 'DRAFT' to 'ACTIVE'.
   * @throws {ListingError} If listing not found, unauthorized, or already published.
   */
  async publishListing(listingId: string, userId: string): Promise<IListing> {
    const listing = await Listing.findOne({ _id: listingId, seller: userId });
    if (!listing) throw new ListingError('Listing not found or you are not authorized.', 404);
    if (listing.status !== 'DRAFT') throw new ListingError('This listing has already been published.', 409);
    listing.status = 'ACTIVE';
    await listing.save();
    GamificationService.logEvent(userId, 'PUBLISH_LISTING').catch(console.error);
    HistoryService.logAction(userId, 'PUBLISH_LISTING', { listingId }).catch(console.error);
    return listing;
  },

  /**
   * Updates an existing listing, ensuring ownership and tiered limits.
   * @throws {ListingError} If listing not found, unauthorized, or photo limit exceeded.
   */
  async updateListing(listingId: string, userId: string, updateData: Partial<ListingInput>): Promise<IListing> {
    const user = await UserService.getUserById(userId);
    const maxPhotos = user.subscription === 'PREMIUM' ? 20 : 5;
    if (updateData.photos?.length > maxPhotos) {
      throw new ListingError(`Your current plan allows up to ${maxPhotos} photos. Upgrade to Premium for more.`, 403);
    }
    if (updateData.photos?.length) {
      await PhotoService.validatePhotoIds(updateData.photos);
    }
    const validatedData = ListingSchema.partial().parse(updateData);
    const updatedListing = await Listing.findOneAndUpdate(
      { _id: listingId, seller: userId },
      { $set: validatedData },
      { new: true }
    );
    if (!updatedListing) {
      throw new ListingError('Listing not found or you are not authorized to edit it.', 404);
    }
    HistoryService.logAction(userId, 'UPDATE_LISTING', { listingId }).catch(console.error);
    return updatedListing;
  },

  /**
   * Deletes a listing, ensuring ownership.
   * @throws {ListingError} If listing not found or unauthorized.
   */
  async deleteListing(listingId: string, userId: string): Promise<{ message: string }> {
    const result = await Listing.deleteOne({ _id: listingId, seller: userId });
    if (result.deletedCount === 0) {
      throw new ListingError('Listing not found or you are not authorized to delete it.', 404);
    }
    HistoryService.logAction(userId, 'DELETE_LISTING', { listingId }).catch(console.error);
    return { message: 'Listing successfully deleted.' };
  },
};

export default ListingService;