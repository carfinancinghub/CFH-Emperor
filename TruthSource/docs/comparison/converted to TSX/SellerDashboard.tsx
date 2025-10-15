// ----------------------------------------------------------------------
// File: SellerDashboard.tsx
// Path: frontend/src/components/dashboards/SellerDashboard.tsx
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:07 PDT
// Version: 2.0.0 (Hook-Based Architecture)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The primary command center for sellers. It provides an at-a-glance
// overview of their listings, auctions, and sales performance.
//
// @architectural_notes
// - **Purely Presentational**: This component has been refactored to be a
//   "dumb" component. All logic is delegated to the `useSellerDashboard`
//   hook, making the UI clean and easy to maintain.
//
// ----------------------------------------------------------------------

import React from 'react';
import { useSellerDashboard } from '@/hooks/useSellerDashboard';

// Placeholder sub-components
const StatCard = ({ title, value }: { title: string; value: any }) => (
  <div className="bg-gray-100 p-4 rounded-lg text-center">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const ListingsPanel = ({ listings }: { listings: any[] }) => (
  <div className="mt-6">
    <h3 className="font-bold">Recent Listings</h3>
    {/* UI to display a list of listings would go here */}
  </div>
);

const AuctionsPanel = ({ auctions }: { auctions: any[] }) => (
  <div className="mt-6">
    <h3 className="font-bold">Active Auctions</h3>
    {/* UI to display a list of auctions would go here */}
  </div>
);


const SellerDashboard = () => {
  const { data, isLoading } = useSellerDashboard();

  if (isLoading) return <div>Loading seller dashboard...</div>;
  if (!data) return <div>Could not load dashboard data.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Seller Dashboard</h2>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Active Listings" value={data.stats.activeListings} />
        <StatCard title="Vehicles Sold" value={data.stats.totalSold} />
        <StatCard title="Total Revenue" value={`$${data.stats.revenue.toLocaleString()}`} />
      </div>

      {/* Listings and Auctions Panels */}
      <div className="mt-8">
        <ListingsPanel listings={data.recentListings} />
        <AuctionsPanel auctions={data.activeAuctions} />
      </div>
    </div>
  );
};

export default SellerDashboard;