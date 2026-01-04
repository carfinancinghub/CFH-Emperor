// @ai-generated via ai-orchestrator
This conversion uses TSX, defines necessary interfaces for strong typing of the API response and state, and explicitly imports `AxiosError` for robust error handling without changing the runtime behavior.

### `LiveDashboardHealthWidget.tsx`

/**
 * File: LiveDashboardHealthWidget.tsx
 * Path: frontend/src/components/admin/LiveDashboardHealthWidget.tsx
 * Purpose: Admin widget to monitor Hauler-related endpoint health in real-time via /api/hauler/health
 * Author: Cod3 (05051700)
 * Date: May 05, 2025
 * 👑 Cod3 Crown Certified
 */

// --- Dependencies ---
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Types and Interfaces ---

/** Defines the expected structure of the Hauler health API response. */
interface HaulerHealthStatus {
  // Using literal types for common status values
  status: 'healthy' | 'unhealthy' | 'error' | 'unknown' | string; 
  // Endpoints map string keys to status strings (e.g., 'up'/'down')
  endpoints: Record<string, 'up' | 'down' | string>;
}

// --- Component Definition ---
/**
 * LiveDashboardHealthWidget Component
 * Purpose: Displays real-time health status of Hauler-related endpoints for admin monitoring
 */
const LiveDashboardHealthWidget = () => {
  // --- State Management ---
  const initialStatus: HaulerHealthStatus = { status: 'unknown', endpoints: {} };
  const [healthStatus, setHealthStatus] = useState<HaulerHealthStatus>(initialStatus);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null); // lastUpdated is a string or null

  // --- API Integration ---
  /**
   * fetchHealthStatus
   * Purpose: Fetch health status from /api/hauler/health and update component state
   */
  const fetchHealthStatus = async (): Promise<void> => {
    try {
      // Explicitly type the expected response data
      const response = await axios.get<HaulerHealthStatus>('/api/hauler/health');
      setHealthStatus(response.data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      // Handle Axios errors robustly
      if (axios.isAxiosError(error)) {
        const axError = error as AxiosError;
        console.error('Failed to fetch hauler health status:', axError.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      
      toast.error('Failed to fetch hauler health status');
      setHealthStatus({ status: 'error', endpoints: {} }); // Set status to error state
    }
  };

  // --- Polling Setup ---
  useEffect(() => {
    fetchHealthStatus(); // Initial fetch
    const interval = setInterval(fetchHealthStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // --- UI Rendering ---
  return (
    <div className="bg-white shadow-md rounded p-4 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Hauler Health Status</h3>
      <p className="mb-3">
        <strong>Overall Status:</strong>{' '}
        <span 
          className={`font-bold ${healthStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}
        >
          {healthStatus.status}
        </span>
      </p>
      <h4 className="font-medium">Endpoints:</h4>
      <ul className="list-disc ml-5">
        {/* Iterate over endpoints object entries */}
        {Object.entries(healthStatus.endpoints).map(([endpoint, status]) => (
          <li key={endpoint} className={status === 'up' ? 'text-green-600' : 'text-red-600'}>
            {endpoint}: {status}
          </li>
        ))}
      </ul>
      {lastUpdated && <p className="mt-3 text-sm text-gray-500">Last Updated: {lastUpdated}</p>}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default LiveDashboardHealthWidget;