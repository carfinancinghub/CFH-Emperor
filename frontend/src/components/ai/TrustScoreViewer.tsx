// 👑 Crown Certified Component — TrustScoreViewer.tsx
// Path: frontend/src/components/ai/TrustScoreViewer.tsx
// Purpose: Displays a user's trust score and premium breakdown, with trend insights.
// Converted from JSX → TSX (manual, ai-orchestrator bypass)

import React, { useEffect, useState } from 'react';
import { api } from '@services/api';
import logger from '@utils/logger';
import { PremiumGate } from '@components/common';
import { Star } from 'lucide-react';

/* ================================
   Types
================================ */

interface TrustScoreBreakdown {
  escrowCompliance: number | string;
  bidConsistency: number | string;
  auctionActivity: number | string;
  trustTrend: string;
}

interface TrustScoreData {
  score: number;
  breakdown?: TrustScoreBreakdown;
}

interface TrustTrendData {
  trend: string;
  confidence: number;
}

interface TrustScoreViewerProps {
  userId: string;
  isPremium: boolean;
}

/* ================================
   Component
================================ */

const TrustScoreViewer: React.FC<TrustScoreViewerProps> = ({
  userId,
  isPremium,
}) => {
  const [scoreData, setScoreData] = useState<TrustScoreData | null>(null);
  const [trend, setTrend] = useState<TrustTrendData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrustScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchTrustScore = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<{ data: TrustScoreData }>(
        '/api/trust/score',
        {
          params: { userId, isPremium },
        }
      );
      setScoreData(response.data.data);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch trust score for user ${userId}`, err);
      setError(
        err?.response?.data?.message ?? 'Unable to load trust score'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTrustTrend = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await api.get<{ data: TrustTrendData }>(
        '/api/trust/trend',
        {
          params: { userId },
        }
      );
      setTrend(response.data.data);
      setError(null);
    } catch (err: any) {
      logger.error(`Failed to fetch trust trend for user ${userId}`, err);
      setError(
        err?.response?.data?.message ?? 'Unable to load trust trend'
      );
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
          <p>
            <strong>Trust Score:</strong> {scoreData.score}/100
          </p>
        </div>
      )}

      <PremiumGate
        isPremium={isPremium}
        message="Detailed trust breakdown requires premium access"
      >
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
              <p>
                <strong>Escrow Compliance:</strong>{' '}
                {scoreData.breakdown.escrowCompliance}
              </p>
              <p>
                <strong>Bid Consistency:</strong>{' '}
                {scoreData.breakdown.bidConsistency}
              </p>
              <p>
                <strong>Auction Activity:</strong>{' '}
                {scoreData.breakdown.auctionActivity}
              </p>
              <p>
                <strong>Trust Trend:</strong>{' '}
                {scoreData.breakdown.trustTrend}
              </p>
            </div>
          )}

          {trend && (
            <p>
              <strong>Trend:</strong> {trend.trend} (Confidence:{' '}
              {(trend.confidence * 100).toFixed(1)}%)
            </p>
          )}
        </div>
      </PremiumGate>
    </div>
  );
};

export default TrustScoreViewer;