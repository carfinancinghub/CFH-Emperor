/**
 * © 2025 CFH, All Rights Reserved
 * File: SellerBadgePanel.tsx
 * Path: C:\CFH\frontend\src\components\auction\SellerBadgePanel.tsx
 * Purpose: Show gamified seller badges and rank visuals gated for premium users
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: 38a2b61c-7d6c-4b8d-a5cd-6e9c4f210f3e
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 0e1d2f3a-4b5c-6d7e-8f90-a1b2c3d4e5f6
 * Save Location: C:\CFH\frontend\src\components\auction\SellerBadgePanel.tsx
 */

import React from 'react';
import logger from '@/utils/logger';

const ARTIFACT_ID = '0e1d2f3a-4b5c-6d7e-8f90-a1b2c3d4e5f6';

export interface SellerStats {
  winRate: number;
  bidVelocity: number; // bids/hour
  engagementScore: number; // 0..100
}

export interface SellerBadgePanelProps {
  sellerStats: SellerStats;
  isPremium: boolean;
}

const SellerBadgePanel: React.FC<SellerBadgePanelProps> = ({ sellerStats, isPremium }) => {
  try {
    if (!isPremium) {
      return <div className="text-sm text-gray-500 italic">Premium feature — upgrade to unlock seller badge analytics.</div>;
    }

    if (!sellerStats || typeof sellerStats !== 'object') {
      throw new Error('Invalid sellerStats input');
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
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: SellerBadgePanel render error: ${errMsg}`);
    return <div className="text-red-600 text-sm">Error rendering seller badge panel</div>;
  }
};

export default SellerBadgePanel;
