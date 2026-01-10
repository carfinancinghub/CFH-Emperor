/**
 * @file theme.ts
 * @path C:\CFH\frontend\src\styles\theme.ts
 *
 * CFH THEME TOKENS (Tailwind class presets)
 * - Purpose: Provide a stable, shared theme object for components (including Emperor-generated TSX)
 * - Policy: Keep keys stable once introduced; add new keys instead of renaming existing ones
 * - Format: Values are Tailwind class strings (no runtime dependency)
 *
 * NOTE
 * - This is intentionally minimal. It exists to prevent build breaks when components import "@/styles/theme".
 * - Expand gradually as UI standardizes across domains.
 */

/* =========================
   Types
========================= */

export type ThemeTokens = {
  // Spacing
  spacingSm: string;
  spacingMd: string;
  spacingLg: string;

  // Typography
  fontSizeSm: string;

  // Text states
  errorText: string;

  // Buttons / interactive
  primaryButton: string;
  secondaryButton: string;
};

/* =========================
   Theme object
========================= */

export const theme: ThemeTokens = {
  // ---- Spacing ----
  spacingSm: "p-2",
  spacingMd: "p-4",
  spacingLg: "p-6",

  // ---- Typography ----
  fontSizeSm: "text-sm",

  // ---- Text states ----
  errorText: "text-red-600",

  // ---- Buttons / interactive ----
  primaryButton:
    "inline-flex items-center justify-center rounded-lg px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300",
  secondaryButton:
    "inline-flex items-center justify-center rounded-lg px-4 py-2 bg-gray-100 text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300",
};
