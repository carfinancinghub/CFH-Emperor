// @ai-generated via ai-orchestrator
To convert this JavaScript to idiomatic TypeScript, we'll add minimal explicit types while preserving the exports and ESM shape. Here's the TypeScript version:

// 👑 Crown Certified Component — TrustScoreViewer.tsx
// Path: frontend/src/components/ai/TrustScoreViewer.tsx
// Purpose: Displays a user's trust score and premium breakdown, with trend insights.
// Author: Rivers Auction Team — May 17, 2025

import React, { useState, useEffect } from 'react';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Star } from 'lucide-react';

interface ScoreData {
  score: number;
  breakdown?: {
    escrowCompliance: string;
    bidConsistency: string;
    auctionActivity: string;
    trustTrend: string;
  };
}

interface TrendData {
  trend: string;
  confidence: number;
}

interface TrustScoreViewerProps {
  userId: string;
  isPremium: boolean;
}

const TrustScoreViewer: React.FC<TrustScoreViewerProps> = ({ userId, isPremium }) => {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [trend, setTrend] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrustScore();
  }, [userId]);

  const fetchTrustScore = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trust/score', {
        params: { userId, isPremium },
      });
      setScoreData(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch trust score for user ${userId}`, err);
      setError(err.response?.data?.message || 'Unable to load trust score');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustTrend = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/trust/trend', {
        params: { userId },
      });
      setTrend(response.data.data);
      setError(null);
    } catch (err) {
      logger.error(`Failed to fetch trust trend for user ${userId}`, err);
      setError(err.response?.data?.message || 'Unable to load trust trend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trust-score-viewer">
      <h3>Trust Score</h3>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}
      {scoreData && (
        <div className="score">
          <Star className="score-icon" />
          <p><strong>Trust Score:</strong> {scoreData.score}/100</p>
        </div>
      )}
      <PremiumGate isPremium={isPremium} message="Detailed trust breakdown requires premium access">
        <div className="breakdown">
          <button
            onClick={fetchTrustTrend}
            disabled={loading}
            className="trend-button"
          >
            Load Trust Trend
          </button>
          {scoreData?.breakdown && (
            <div>
              <p><strong>Escrow Compliance:</strong> {scoreData.breakdown.escrowCompliance}</p>
              <p><strong>Bid Consistency:</strong> {scoreData.breakdown.bidConsistency}</p>
              <p><strong>Auction Activity:</strong> {scoreData.breakdown.auctionActivity}</p>
              <p><strong>Trust Trend:</strong> {scoreData.breakdown.trustTrend}</p>
            </div>
          )}
          {trend && (
            <p><strong>Trend:</strong> {trend.trend} (Confidence: {(trend.confidence * 100).toFixed(1)}%)</p>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default TrustScoreViewer;

/*
Functions Summary:
- TrustScoreViewer
  - Purpose: User-facing component to display trust score and premium breakdown
  - Inputs:
    - userId: string (required)
    - isPremium: boolean (required)
  - Outputs: React component rendering trust score and breakdown panel
  - Features:
    - Displays trust score via calculateTrustScore
    - Premium-gated breakdown and trend via calculateTrustScore and predictTrustTrend
    - Error handling for API failures
  - Dependencies: react, @services/api, @utils/logger, @components/common/PremiumGate, lucide-react
*/

Key changes and explanations:

1. File extension changed from `.jsx` to `.tsx` to reflect TypeScript usage.

2. Added type interfaces:
   - `ScoreData` to represent the structure of the score data.
   - `TrendData` to represent the structure of the trend data.
   - `TrustScoreViewerProps` to define the props for the component.

3. Updated the component declaration to use `React.FC<TrustScoreViewerProps>` for better type checking of props.

4. Added type annotations to state variables:
   - `scoreData: ScoreData | null`
   - `trend: TrendData | null`
   - `error: string | null`

5. Removed the `PropTypes` import and definition, as TypeScript provides type checking.

6. Kept the existing structure and logic of the component intact, ensuring no runtime changes.

7. Preserved the export statement and overall ESM shape.

8. Maintained the comments and function summary at the end of the file.

This TypeScript version provides better type safety while keeping the same functionality as the original JavaScript component.