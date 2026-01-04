// @ai-generated via ai-orchestrator
// This file is converted to TSX to support JSX syntax and TypeScript typing. Since the structure of the external service response (`fetchBuyerAuctionHistory`) is crucial for internal state management, we must define the expected types for the data structures (`AuctionHistoryEntry` and `AnalyticsData`).

// ### `frontend/src/components/buyer/BuyerAuctionHistory.tsx`

// File: BuyerAuctionHistory.tsx
// Path: frontend/src/components/buyer/BuyerAuctionHistory.js
// Purpose: Display buyer’s auction history with premium visual insights
// Author: Rivers Auction Team
// Editor: Cod1 (05141438 - PDT) — Created with analytics + premium gating
// 👑 Cod2 Crown Certified

import React, { useEffect, useState } from 'react';
// PropTypes is removed as TypeScript handles static type checking
import logger from '@utils/logger';
// Assuming the service function signature is handled by module resolution,
// but we define the expected return structures for type safety.
import { fetchBuyerAuctionHistory } from '@services/buyer/AuctionHistoryService';
import PremiumChart from '@components/common/PremiumChart';

// --- TYPE DEFINITIONS ---

interface AuctionHistoryEntry {
  // We infer these fields from how they are used in the component
  auctionId: string | number;
  date: string;
  item: string;
  status: string;
}

// Analytics data shape is generally complex for charts, using a flexible placeholder
// unless the exact shape required by PremiumChart is known.
type AnalyticsData = Record<string, unknown> | Array<unknown>;

interface FetchHistoryResult {
  history: AuctionHistoryEntry[];
  analytics?: AnalyticsData;
}

interface BuyerAuctionHistoryProps {
  userId: string;
  isPremium: boolean;
}

// Assuming the imported service function is defined elsewhere as:
// declare function fetchBuyerAuctionHistory(userId: string, isPremium: boolean): Promise<FetchHistoryResult>;

/**
 * Functions Summary:
 * - fetchBuyerAuctionHistory(userId): Loads history from backend
 * - renderPremiumAnalytics(): Shows bid trend visual if isPremium
 * Inputs: userId, isPremium
 * Outputs: Buyer auction list with optional analytics
 * Dependencies: @services/buyer/AuctionHistoryService, @components/common/PremiumChart, @utils/logger
 */
const BuyerAuctionHistory: React.FC<BuyerAuctionHistoryProps> = ({ userId, isPremium }) => {
  // State Initialization with explicit types based on defined interfaces
  const [history, setHistory] = useState<AuctionHistoryEntry[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setError(null); // Clear previous errors
      try {
        // We rely on the service to return Promise<FetchHistoryResult>
        const result: FetchHistoryResult = await fetchBuyerAuctionHistory(userId, isPremium);
        
        setHistory(result.history);
        
        if (isPremium && result.analytics) {
          setAnalytics(result.analytics);
        }
      } catch (err) {
        // Type assertion for error logging consistency
        logger.error('Failed to load buyer auction history:', (err as Error).message);
        setError('Could not fetch auction history.');
      }
    }

    if (userId) {
      loadData();
    }
  }, [userId, isPremium]);

  const renderPremiumAnalytics = (): JSX.Element | null => {
    if (!isPremium) {
      return <p className="text-sm text-gray-500">Premium analytics — upgrade to unlock.</p>;
    }
    if (!analytics) return null;
    
    // Type checking ensures 'analytics' is present and matches the expected type for PremiumChart
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Your Bid Patterns</h3>
        {/* We cast analytics here because we checked for null above */}
        <PremiumChart data={analytics} />
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Auction History</h2>
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-2">
        {history.map((entry) => (
          // Use entry.auctionId for key, ensuring it's defined per the interface
          <li key={entry.auctionId} className="text-gray-800">
            {entry.date} — {entry.item} ({entry.status})
          </li>
        ))}
      </ul>
      {renderPremiumAnalytics()}
    </div>
  );
};

// PropTypes removed.
export default BuyerAuctionHistory;