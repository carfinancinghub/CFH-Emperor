// @ai-generated via ai-orchestrator
This conversion utilizes modern TypeScript practices, introduces explicit data interfaces, applies types to React state and hooks, and removes the deprecated `prop-types` dependency.

### `frontend/src/components/buyer/BuyerAnalyticsDashboard.tsx`

/**
 * File: BuyerAnalyticsDashboard.tsx
 * Path: frontend/src/components/buyer/BuyerAnalyticsDashboard.tsx
 * Purpose: AI-powered analytics dashboard for buyers with visual ROI simulators, smart exports, and benchmark engine
 * Author: SG, Cod1
 * Date: May 25, 2025
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features: (Omitted for brevity)
 * Dependencies: (Omitted for brevity)
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, ArcElement, ChartData } from 'chart.js';
import Button from '@components/common/Button';
import { exportAnalyticsToPDF, exportAnalyticsToCSV } from '@utils/analyticsExportUtils';
import LoadingSpinner from '@components/common/LoadingSpinner';
import logger from '@utils/logger';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

// --- Type Definitions ---

interface PurchaseData {
  month: string;
  count: number;
}

interface BrandData {
  brand: string;
  count: number;
}

interface BidHistoryData {
  date: string;
  successRate: number;
}

interface MarketTrendData {
  month: string;
  avgPrice: number;
}

interface AnalyticsData {
  purchases: PurchaseData[];
  favoriteBrands: BrandData[];
  bidHistory: BidHistoryData[];
  marketTrends: MarketTrendData[];
  totalSaved: number;
}

interface BuyerAnalyticsDashboardProps {
  buyerId: string;
}

// Register Chart.js components globally
ChartJS.register(BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const BuyerAnalyticsDashboard: React.FC<BuyerAnalyticsDashboardProps> = ({ buyerId }) => {
  // State Management
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Analytics Data on Component Mount or BuyerId Change
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/buyer/${buyerId}/analytics`);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to load analytics: ${res.status} ${errorText}`);
        }
        const result: AnalyticsData = await res.json();
        setData(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during fetch.';
        setError(errorMessage);
        logger.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [buyerId]);

  // Simulate Optimal Bid Suggestion
  const simulateBidSuggestion = (): void => {
    if (!data || data.bidHistory.length === 0) {
        alert("Cannot simulate bid suggestion: Data missing.");
        return;
    }

    const totalSuccessRate = data.bidHistory.reduce((sum, b) => sum + b.successRate, 0);
    const avg = totalSuccessRate / data.bidHistory.length;
    
    // Safety check for non-zero division is handled by length check above
    alert(`🎯 Try bidding ~${(avg - 1.7).toFixed(1)}% below market. Success odds: ${(avg + 3).toFixed(1)}%`);
  };

  // Render Loading State
  if (loading) return <LoadingSpinner />;

  // Render Error State
  if (error) return <div className={`text-red-500 text-center ${theme.spacingMd}`}>Error: {error}</div>;

  // Render check for data integrity (should be redundant if error/loading checks pass, but good practice)
  if (!data) return <div className={`text-gray-500 text-center ${theme.spacingMd}`}>No analytics data available.</div>;

  // Chart Data Configurations using useMemo for stability
  
  // Note: We cast the results to ChartData<'chartType'> to satisfy ChartJS type requirements
  
  const purchaseBarData = useMemo<ChartData<'bar'>>(() => ({
    labels: data.purchases.map((p) => p.month),
    datasets: [{ 
      label: 'Purchases', 
      data: data.purchases.map((p) => p.count), 
      backgroundColor: '#3b82f6' 
    }],
  }), [data.purchases]);

  const brandPieData = useMemo<ChartData<'pie'>>(() => ({
    labels: data.favoriteBrands.map((b) => b.brand),
    datasets: [{ 
      label: 'Brands', 
      data: data.favoriteBrands.map((b) => b.count), 
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] 
    }],
  }), [data.favoriteBrands]);

  const bidSuccessLine = useMemo<ChartData<'line'>>(() => ({
    labels: data.bidHistory.map((b) => b.date),
    datasets: [{ 
      label: 'Success %', 
      data: data.bidHistory.map((b) => b.successRate), 
      borderColor: '#10b981', 
      backgroundColor: 'rgba(16,185,129,0.2)', 
      tension: 0.3 
    }],
  }), [data.bidHistory]);

  const marketTrendBar = useMemo<ChartData<'bar'>>(() => ({
    labels: data.marketTrends.map((m) => m.month),
    datasets: [{ 
      label: 'Avg Car Price', 
      data: data.marketTrends.map((m) => m.avgPrice), 
      backgroundColor: '#f59e0b' 
    }],
  }), [data.marketTrends]);


  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="Buyer Analytics Dashboard - CFH Auction Platform" />
      <div className={`max-w-6xl mx-auto ${theme.spacingLg} bg-white ${theme.cardShadow} ${theme.borderRadius} space-y-10`}>
        <h2 className="text-3xl font-bold text-gray-800">📊 Buyer Analytics Dashboard</h2>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">🛒 Purchases Over Time</h3>
          <Bar data={purchaseBarData} />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">❤️ Favorite Brands</h3>
          <Pie data={brandPieData} />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📈 Bid Success Rate</h3>
          <Line data={bidSuccessLine} />
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">📊 Market Price Trends</h3>
          <Bar data={marketTrendBar} />
        </section>

        <div className={`${theme.successText} font-bold text-xl`}>
          🎉 You've saved ${data.totalSaved.toLocaleString()} through smart bids!
        </div>

        <div className="flex gap-4 flex-wrap mt-6">
          <Button
            className="bg-emerald-600 text-white"
            onClick={simulateBidSuggestion}
            aria-label="Simulate AI bid suggestion"
          >
            🎯 AI Bid Assistant
          </Button>
          <Button
            className={`${theme.primaryButton}`}
            onClick={() => exportAnalyticsToPDF(data)}
            aria-label="Export analytics to PDF"
          >
            📄 Export PDF
          </Button>
          <Button
            className={`${theme.warningText} bg-yellow-500`}
            onClick={() => exportAnalyticsToCSV(data)}
            aria-label="Export analytics to CSV"
          >
            🧾 Export CSV
          </Button>
          <Button
            className={`${theme.secondaryButton}`}
            onClick={() => window.location.reload()}
            aria-label="Refresh analytics data"
          >
            🔁 Refresh
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BuyerAnalyticsDashboard;