// @ai-generated via ai-orchestrator
This file is converted to TSX. The `prop-types` usage is replaced with an explicit TypeScript interface, and state variables and fetched data structures are explicitly typed.

### `frontend/src/components/auction/AuctionIntelligenceDashboard.tsx`

/**
 * File: AuctionIntelligenceDashboard.tsx
 * Path: frontend/src/components/auction/AuctionIntelligenceDashboard.tsx
 * Purpose: Auction analytics and AI-powered bidding insights dashboard for the CFH Auction role
 * Author: Cod2
 * Date: 2025-05-09
 * Updated: Converted to TypeScript/TSX, added type definitions for props, state, and API data.
 * Cod2 Crown Certified: Yes
 * Dependencies: ChartJS, Line, Bar, PremiumFeature, ToastManager, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import PremiumFeature from '@components/common/PremiumFeature';
import ToastManager from '@components/common/ToastManager';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

// --- Type Definitions ---

// Define the expected structure for predicted bids
interface PredictedBid {
  item: string;
  amount: number | string;
}

// Define the data structure expected from the analytics API endpoint.
// We use generic ChartData from chart.js types for correctness.
interface AnalyticsData {
  bidTrends: ChartData<'line'>;
  winRates: ChartData<'bar'>;
  predictedWinningBids?: PredictedBid[];
}

interface DashboardProps {
  defaultTimeframe?: string;
  defaultCategory?: string;
}

// --- Chart Registration ---
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Define chart options once
const chartOptions: ChartOptions<'line' | 'bar'> = {
  responsive: true,
};

const AuctionIntelligenceDashboard: React.FC<DashboardProps> = ({
  defaultTimeframe = 'last_7_days',
  defaultCategory = 'vehicles'
}) => {
  // State Management
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<string>(defaultTimeframe);
  const [category, setCategory] = useState<string>(defaultCategory);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Auction Analytics Data
  const fetchAnalytics = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(`/auctions/analytics?timeframe=${timeframe}&category=${category}`);
      if (!res.ok) {
        // Attempt to parse error message if available, otherwise use generic message
        const errorText = await res.text();
        throw new Error(`Failed to load auction analytics: ${res.status} ${errorText.substring(0, 50)}...`);
      }
      const data: AnalyticsData = await res.json();
      setAnalytics(data);
    } catch (err) {
      // Ensure error message is a string for ToastManager
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during data fetch.';
      ToastManager.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data on Mount and Every 15 Seconds if Document is Visible
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      if (!document.hidden) fetchAnalytics();
    }, 15000);
    return () => clearInterval(interval);
  }, [timeframe, category]);

  // Define an empty ChartData object for fallback, satisfying ChartData<'type'> requirements
  const emptyChartData: ChartData<any> = { labels: [], datasets: [] };

  // Render Line Chart for Bid Trends
  const renderLineChart = (): JSX.Element => (
    <Line
      // TS ensures data conforms to ChartData<'line'>
      data={analytics?.bidTrends || emptyChartData as ChartData<'line'>}
      options={chartOptions}
      aria-label="Bid Trends Line Chart"
      role="img"
      data-testid="bid-trends-chart"
    />
  );

  // Render Bar Chart for Win Rates
  const renderBarChart = (): JSX.Element => (
    <Bar
      // TS ensures data conforms to ChartData<'bar'>
      data={analytics?.winRates || emptyChartData as ChartData<'bar'>}
      options={chartOptions}
      aria-label="Win Rate Bar Chart"
      role="img"
      data-testid="win-rate-chart"
    />
  );

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Auction Intelligence Dashboard - CFH Auction Platform" />
      <div className="bg-gray-100 min-h-screen p-6" aria-label="Auction Intelligence Dashboard" role="region">
        <div className="container mx-auto space-y-8">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Timeframe Filter */}
            <select
              value={timeframe}
              onChange={e => setTimeframe(e.target.value)}
              className={`border border-gray-300 ${theme.borderRadius} ${theme.spacingSm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Timeframe Filter"
              data-testid="timeframe-dropdown"
            >
              <option value="last_7_days">Last 7 Days</option>
              <option value="last_30_days">Last 30 Days</option>
            </select>
            {/* Category Filter */}
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={`border border-gray-300 ${theme.borderRadius} ${theme.spacingSm} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              aria-label="Category Filter"
              data-testid="category-dropdown"
            >
              <option value="vehicles">Vehicles</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>

          {loading && <p className="text-gray-600" data-testid="loading-text">Loading auction analytics...</p>}
          {!loading && analytics && (
            <>
              {/* Bid Trends Chart */}
              <section className="bg-white rounded-lg shadow-md p-6">{renderLineChart()}</section>

              {/* Win Rates Chart */}
              <section className="bg-white rounded-lg shadow-md p-6">{renderBarChart()}</section>

              {/* Premium AI Feature */}
              <PremiumFeature flag="aiAuctionInsights">
                <section
                  className={`bg-white ${theme.borderRadius} ${theme.cardShadow} ${theme.spacingLg}`}
                  aria-label="AI Predictions Panel"
                  role="complementary"
                  data-testid="ai-predictions-panel"
                >
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Predicted Winning Bids (AI)</h3>
                  <ul className="space-y-1">
                    {/* Ensure optional chaining is used */}
                    {analytics.predictedWinningBids?.map((bid, idx) => (
                      <li key={idx} className="text-gray-600">{`${bid.item}: $${bid.amount}`}</li>
                    ))}
                  </ul>
                </section>
              </PremiumFeature>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AuctionIntelligenceDashboard;