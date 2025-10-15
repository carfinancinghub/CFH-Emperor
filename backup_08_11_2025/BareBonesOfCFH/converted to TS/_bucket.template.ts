// File: _bucket.template.ts
// Path: docs/buckets/_bucket.template.ts
// Purpose: This is the master template for creating a strategic "idea bucket" for a major application domain.
// Author: Mini, System Architect
// Date: August 10, 2025
// 👑 Cod1 Crown Certified — A standard for strategic planning and technical debt tracking.

// HOW TO USE:
// 1. Copy this file to a relevant directory (e.g., `docs/buckets/sellerBucket.ts`).
// 2. Fill in the arrays with domain-specific information.
// 3. Link items to your project management tool via the 'ticketId' property.

// --- Type Definitions ---
interface IDeprecatedEndpoint {
  route: string;
  reason: string;
  lastUsed: string;
  ticketId?: string; // e.g., 'JIRA-123'
}

interface IDeferredComponent {
  component: string;
  path: string;
  reason: string;
  ticketId?: string;
}

interface IEnhancementIdea {
  idea: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  implementationNotes: string;
  ticketId?: string;
}

// --- Data ---
export const endpointsNotUsed: IDeprecatedEndpoint[] = [
  // {
  //   route: '/api/seller/deprecated-analytics',
  //   reason: 'Replaced by the new analytics system.',
  //   lastUsed: 'April 2025',
  //   ticketId: 'PROJ-456'
  // }
];

export const componentsDeferred: IDeferredComponent[] = [
  // {
  //   component: 'SellerReputationWidget.jsx',
  //   path: 'frontend/src/components/seller/SellerReputationWidget.jsx',
  //   reason: 'Deferred to focus on core MVP features.',
  //   ticketId: 'PROJ-457'
  // }
];

export const enhancementsSuggested: IEnhancementIdea[] = [
  // {
  //   idea: 'Domain-Specific Loyalty Tier System',
  //   description: 'Reward users for high-value actions within this domain.',
  //   priority: 'High',
  //   implementationNotes: 'Requires integration with a central LoyaltyProgramEngine service.',
  //   ticketId: 'PROJ-458'
  // },
];