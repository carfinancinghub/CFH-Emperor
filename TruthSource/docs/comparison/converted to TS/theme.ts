// File: theme.ts
// Path: frontend/src/styles/theme.ts
// Purpose: Centralized theme configuration and design tokens for the Rivers Auction platform.
// Author: Rivers Auction Team
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — The single source of truth for all styling constants.

// TODO:
// @free:
//   - [ ] Evolve this into a true token-based system. Define raw values (e.g., colors, spacing units) and consume them in `tailwind.config.js` to enable semantic classes like `bg-primary`, `text-danger`, etc.
//   - [ ] Create a helper utility function (e.g., `cn` or `clsx`) and standardize its use across the app for conditionally combining these theme classes with others.
// @premium:
//   - [ ] ✨ Implement a theme switcher for Light/Dark modes. This file would export different theme objects based on the selected mode.
//   - [ ] ✨ Add a 'compact' mode theme variant that reduces padding (`spacing...`) for information-dense admin dashboards.
// @wow:
//   - [ ] 🚀 Build a user-facing theme customizer for institutional clients, allowing them to apply their own brand colors to the dashboard for a white-label experience.

/**
 * A collection of shared Tailwind CSS class strings for maintaining a consistent
 * look and feel across the application.
 */
export const theme = {
  // --- Semantic Text Styles ---
  errorText: 'text-red-600 font-semibold',
  successText: 'text-green-600 font-semibold',
  warningText: 'text-yellow-600 font-semibold',
  infoText: 'text-blue-600 font-semibold',

  // --- Semantic Button Styles ---
  primaryButton: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  secondaryButton: 'bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  dangerButton: 'bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  outlineButton: 'border border-gray-500 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',

  // --- Layout & Utility Classes ---
  cardShadow: 'shadow-md',
  borderRadius: 'rounded-lg',
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',

  // --- Font Size Tokens ---
  fontSizeSm: 'text-sm',
  fontSizeBase: 'text-base',
  fontSizeLg: 'text-lg',

  // --- Spacing Tokens ---
  spacingSm: 'p-2',
  spacingMd: 'p-4',
  spacingLg: 'p-6',
};

// We can also define a type for added safety, although it's simple.
export type Theme = typeof theme;