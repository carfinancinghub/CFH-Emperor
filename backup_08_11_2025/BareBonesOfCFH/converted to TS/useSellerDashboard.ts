// ----------------------------------------------------------------------
// File: useSellerDashboard.ts
// Path: frontend/src/hooks/useSellerDashboard.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:07 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A hook to manage all data fetching and state for the Seller Dashboard.
// It fetches a consolidated payload of stats, listings, and auctions.
//
// @architectural_notes
// - **Consolidated Data Fetching**: This hook makes a single API call to a
//   dedicated endpoint (/api/seller/dashboard) to get all required data at
//   once, improving performance and reducing network requests.
//
// ----------------------------------------------------------------------

import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the shape of the data we expect from our new API endpoint
interface SellerDashboardData {
  stats: { activeListings: number; totalSold: number; revenue: number };
  recentListings: any[];
  activeAuctions: any[];
}

export const useSellerDashboard = () => {
  const [data, setData] = useState<SellerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // This is a new, more efficient endpoint we will need to create on the backend.
        const response = await axios.get('/api/seller/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch seller dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, isLoading };
};