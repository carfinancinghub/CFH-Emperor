// ----------------------------------------------------------------------
// File: gamification.config.ts
// Path: backend/config/gamification.config.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:17 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

export const POINTS_MAP = {
  CREATE_LISTING: 100,
  COMPLETE_SALE: 500,
  RECEIVE_5_STAR_REVIEW: 50,
  PLACE_BID: 10,
};

export const BADGES = {
  FIRST_LISTING: {
    name: 'First Listing',
    description: 'You created your first vehicle listing!',
    iconUrl: '/badges/first_listing.png',
    criteria: { event: 'CREATE_LISTING', count: 1 },
  },
  POWER_SELLER: {
    name: 'Power Seller',
    description: 'You successfully sold 5 vehicles!',
    iconUrl: '/badges/power_seller.png',
    criteria: { event: 'COMPLETE_SALE', count: 5 },
  },
  // ... more badges
};