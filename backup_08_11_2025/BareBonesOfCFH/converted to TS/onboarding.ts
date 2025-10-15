// ----------------------------------------------------------------------
// File: onboarding.ts
// Path: backend/src/config/onboarding.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 11:52 AM PDT
// Version: 1.0.0
// ----------------------------------------------------------------------
//
// @description
// A centralized configuration file for defining role-based onboarding tracks.
// This serves as the single source of truth for all onboarding checklists.

/**
 * Defines the sequence of onboarding tasks for each user role.
 * - 'seller': Tasks for users listing vehicles.
 * - 'buyer': Tasks for users looking to purchase.
 * - 'default': A fallback for any other user role.
 */
export const onboardingTracks = {
  seller: [
    { id: 'complete_profile', name: 'Complete your seller profile', link: '/profile/edit' },
    { id: 'create_listing', name: 'Create your first vehicle listing', link: '/seller/listings/new' },
    { id: 'review_dashboard', name: 'Review your seller dashboard', link: '/seller/dashboard' },
  ],
  buyer: [
    { id: 'complete_profile', name: 'Complete your buyer profile', link: '/profile/edit' },
    { id: 'set_preferences', name: 'Set your vehicle preferences', link: '/buyer/preferences' },
    { id: 'browse_listings', name: 'Browse the marketplace', link: '/listings' },
  ],
  default: [
    { id: 'complete_profile', name: 'Complete your profile', link: '/profile/edit' },
  ]
};