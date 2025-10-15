// @ai-generated via ai-orchestrator
This conversion maintains the existing component logic, file structure (TSX for JSX), and applies strong typing to state, network responses, and functions, following idiomatic TypeScript practices.

### `AIPredictorDashboard.tsx`

```tsx
/**
 * File: AIPredictorDashboard.tsx
 * Path: frontend/src/components/ai/AIPredictorDashboard.tsx
 * Purpose: Centralized UI for viewing AI-powered results (dispute predictions, fraud alerts)
 * Author: Cod2
 * Date: 2025-04-29
 * Updated: Added SEOHead, used AdminLayout, applied theme.js utilities, enhanced comments and accessibility
 * Cod2 Crown Certified: Yes
 * Features:
 * - Displays AI-generated dispute predictions with confidence scores
 * - Shows fraud alerts with user ID, pattern, and severity
 * - Export functionality for full AI report in PDF format
 * - Responsive layout with TailwindCSS and toast notifications
 * Functions:
 * - fetchAIResults(): Fetches dispute predictions and fraud alerts from /api/ai endpoints
 * - handleExportPDF(): Exports AI report as a PDF via /api/ai/export-report
 * Dependencies: axios, toast, LoadingSpinner, ErrorBoundary, Button, AdminLayout, SEOHead, theme
 */

// Imports
import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
// Assuming these paths are configured aliases
import LoadingSpinner from '@components/common/LoadingSpinner';
import ErrorBoundary from '@components/common/ErrorBoundary';
import { Button } from '@components/common/Button';
import AdminLayout from '@components/admin/layout/AdminLayout';
import SEOHead from '@components/common/SEOHead';
import { theme } from '@styles/theme';

// --- Type Definitions ---

interface DisputePrediction {
  disputeId: string;
  confidence: number;
  predictedWinner: string;
}

interface FraudAlert {
  userId: string;
  pattern: string;
  severity: string;
}

// --- Component Definition ---

const AIPredictorDashboard: React.FC = () => {
  // State Management
  const [disputePredictions, setDisputePredictions] = useState<DisputePrediction[]>([]);
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch AI Reports from Backend
  useEffect(() => {
    const fetchAIResults = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Auth token missing');

        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

        // Use generics to type the expected response data
        const [disputesRes, fraudRes] = await Promise.all([
          axios.get<DisputePrediction[]>('/api/ai/dispute-predictions', authHeaders),
          axios.get<FraudAlert[]>('/api/ai/fraud-alerts', authHeaders),
        ]);

        // Ensure data is an array or default to empty array
        setDisputePredictions(disputesRes.data || []);
        setFraudAlerts(fraudRes.data || []);
      } catch (err) {
        // Use type assertion for handling Axios errors and potentially custom error messages
        const error = err as AxiosError<{ message?: string }> | Error;
        
        if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message || 'Failed to load AI results');
        } else {
            toast.error(error.message || 'An unknown error occurred.');
        }

      } finally {
        setLoading(false);
      }
    };

    fetchAIResults();
  }, []);

  // Export AI Report as PDF
  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required for export.');
        return;
      }
      
      // Request PDF as a binary blob
      const res = await axios.get('/api/ai/export-report', {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle the blob response for download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AI_Report.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up the element

    } catch (err) {
      // General error handling for export failure
      toast.error('PDF export failed. Please try again.');
    }
  };

  // Render Loading State
  if (loading) return <LoadingSpinner />;

  // UI Rendering
  return (
    <AdminLayout>
      <SEOHead title="AI Predictor Dashboard - CFH Auction Platform" />
      <ErrorBoundary>
        <div className={`${theme.spacingLg}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">AI Predictor Dashboard</h2>

          {/* Dispute Predictions Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-blue-600">Dispute Predictions ({disputePredictions.length})</h3>
            </div>
            <ul className="space-y-3 mt-3">
              {disputePredictions.map((pred, idx) => (
                // Using index as key is acceptable here since the list order is stable and items aren't manipulated
                <li key={idx} className={`bg-blue-50 ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                  <p className={`${theme.fontSizeSm} text-gray-700`}>
                    <strong>Dispute ID:</strong> {pred.disputeId} | 
                    <strong> Confidence:</strong> {pred.confidence.toFixed(0)}% | 
                    <strong> Likely Winner:</strong> {pred.predictedWinner}
                  </p>
                </li>
              ))}
              {disputePredictions.length === 0 && (
                <li className="text-gray-500 italic">No dispute predictions available.</li>
              )}
            </ul>
          </div>

          {/* Fraud Alerts Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-red-600">Fraud Alerts ({fraudAlerts.length})</h3>
            <ul className="space-y-3 mt-3">
              {fraudAlerts.map((alert, idx) => (
                <li key={idx} className={`bg-red-50 ${theme.spacingMd} ${theme.borderRadius} ${theme.cardShadow}`}>
                  <p className={`${theme.fontSizeSm} text-gray-700`}>
                    <strong>User ID:</strong> {alert.userId} | 
                    <strong> Pattern:</strong> {alert.pattern} | 
                    <strong> Severity:</strong> {alert.severity}
                  </p>
                </li>
              ))}
              {fraudAlerts.length === 0 && (
                <li className="text-gray-500 italic">No fraud alerts detected.</li>
              )}
            </ul>
          </div>

          {/* Export Button */}
          <div className="text-center">
            <Button
              onClick={handleExportPDF}
              className={`${theme.successText} bg-green-600 hover:bg-green-700`}
              aria-label="Export full AI report as PDF"
            >
              Export Full AI Report (PDF)
            </Button>
          </div>
        </div>
      </ErrorBoundary>
    </AdminLayout>
  );
};

export default AIPredictorDashboard;
```