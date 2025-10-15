/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionHistoryTracker.tsx
 * Path: C:\CFH\frontend\src\components\auction\core\AuctionHistoryTracker.tsx
 * Purpose: Show auction bid history, premium insights like heatmaps, blockchain logs, seller badges
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: 2b1a7c8d-3e4f-5a6b-7c8d-9e0f1a2b3c4d
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 9c8b7a6d-5e4f-3c2b-1a0f-8e7d6c5b4a3f
 * Save Location: C:\CFH\frontend\src\components\auction\core\AuctionHistoryTracker.tsx
 */

import React from 'react';
import logger from '@/utils/logger';
import HeatmapChart, { HeatmapPoint } from '@/components/common/HeatmapChart';
import BlockchainSnapshotViewer, { Snapshot } from '@/components/common/BlockchainSnapshotViewer';
import SellerBadgePanel, { SellerStats } from '@/components/auction/SellerBadgePanel';

const ARTIFACT_ID = '9c8b7a6d-5e4f-3c2b-1a0f-8e7d6c5b4a3f';

export interface BidHistoryItem {
  time: string;
  amount: number;
}

export interface AuctionHistoryTrackerProps {
  bidHistory: BidHistoryItem[];
  heatmapData: HeatmapPoint[];
  snapshot: Snapshot;
  sellerStats: SellerStats;
  isPremium: boolean;
}

const AuctionHistoryTracker: React.FC<AuctionHistoryTrackerProps> = ({
  bidHistory,
  heatmapData,
  snapshot,
  sellerStats,
  isPremium,
}) => {
  try {
    return (
      <div className="p-4 border bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Auction History Tracker</h2>

        <section className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Basic Bid History</h3>
          <ul className="text-sm space-y-1">
            {bidHistory.map((bid, idx) => (
              <li key={idx} className="text-gray-700">
                <span className="font-mono">{bid.time}</span>: ${bid.amount}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-4">
          <HeatmapChart data={heatmapData} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <BlockchainSnapshotViewer snapshot={snapshot} isPremium={isPremium} />
        </section>

        <section className="mb-4">
          <SellerBadgePanel sellerStats={sellerStats} isPremium={isPremium} />
        </section>
      </div>
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    logger.error(`${ARTIFACT_ID}: AuctionHistoryTracker render error: ${errMsg}`);
    return <div className="text-red-600">Error displaying auction history</div>;
  }
};

export default AuctionHistoryTracker;
