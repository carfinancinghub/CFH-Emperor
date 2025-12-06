// @ai-generated via ai-orchestrator
This conversion utilizes interfaces to define prop shapes, replacing the deprecated `PropTypes` pattern, which is standard practice in idiomatic TypeScript React development.

### `SellerBadgePanel.tsx`

// File: SellerBadgePanel.tsx
// Path: frontend/src/components/auction/SellerBadgePanel.tsx
// Purpose: Show gamified seller badges and rank visuals gated for premium users
// Author: Rivers Auction Team
// Date: May 12, 2025
// 👑 Cod2 Crown Certified

import React from 'react';
import logger from '@/utils/logger';

// Define the shape of the complex data structure
interface SellerStats {
  winRate: number;
  bidVelocity: number;
  engagementScore: number;
}

// Define the component props
interface SellerBadgePanelProps {
  sellerStats: SellerStats;
  isPremium: boolean;
}

/**
 * SellerBadgePanel Component
 * @param {SellerBadgePanelProps} props - Includes sellerStats and isPremium flag.
 */
const SellerBadgePanel = ({ sellerStats, isPremium }: SellerBadgePanelProps) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock seller badge analytics.</div>;
    }

    // While TS ensures sellerStats is the correct type if supplied by a TS consumer,
    // we keep the existence check as a defensive runtime measure against dynamic data issues.
    if (!sellerStats) {
      // Note: The original JS check for `typeof sellerStats !== 'object'` is redundant
      // here because the TS interface guarantees the shape, but checking for null/undefined is safe.
      throw new Error('Invalid sellerStats input: Object is missing.');
    }

    const { winRate, bidVelocity, engagementScore } = sellerStats;

    return (
      <div className="p-4 border rounded bg-white shadow">
        <h3 className="text-lg font-semibold mb-2">Seller Rank & Badge Panel</h3>
        <ul className="text-sm space-y-1">
          <li>🏆 Win Rate: <span className="font-medium">{winRate}%</span></li>
          <li>⚡ Bid Velocity: <span className="font-medium">{bidVelocity} bids/hour</span></li>
          <li>🔥 Engagement Score: <span className="font-medium">{engagementScore}/100</span></li>
        </ul>
      </div>
    );
  } catch (error) {
    // TypeScript generally types 'error' as 'unknown' in catch blocks.
    logger.error('SellerBadgePanel render error:', error);
    return <div className="text-red-600 text-sm">Error rendering seller badge panel</div>;
  }
};

// PropTypes are removed, relying entirely on the TypeScript interface definition.
export default SellerBadgePanel;