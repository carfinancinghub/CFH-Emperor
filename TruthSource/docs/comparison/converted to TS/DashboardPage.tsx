// ----------------------------------------------------------------------
// File: DashboardPage.tsx
// Path: frontend/src/pages/DashboardPage.tsx
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:58 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The main dashboard shell for the entire application. It acts as a router,
// determining the user's primary role and rendering the correct specialized
// dashboard component.
//
// @architectural_notes
// - **Role-Aware Rendering**: This component uses a simple but powerful
//   logic block to ensure each user gets a tailored experience.
// - **Scalable by Design**: Adding a new dashboard for a new role (e.g.,
//   'TITLE_AGENT') is as simple as adding a new case to the switch statement.
//
// ----------------------------------------------------------------------

import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';

// Import placeholder dashboards (these would be created next)
// import SellerDashboard from '@/components/dashboards/SellerDashboard';
// import LenderDashboard from '@/components/dashboards/LenderDashboard';
// import AdminDashboard from '@/components/dashboards/AdminDashboard';
// import BuyerDashboard from '@/components/dashboards/BuyerDashboard';

// A simple placeholder component
const PlaceholderDashboard = ({ role }: { role: string }) => (
  <div className="p-4">
    <h2 className="text-xl font-bold">Welcome!</h2>
    <p>Your {role} dashboard is under construction.</p>
  </div>
);


const DashboardPage = () => {
  const { user, isLoading, error } = useDashboard();

  if (isLoading) return <div>Loading Dashboard...</div>;
  if (error || !user) return <div>Error loading your information. Please try again.</div>;

  // Logic to determine the primary role and render the correct dashboard
  const renderDashboardByRole = () => {
    // This logic can be enhanced to handle users with multiple roles
    const primaryRole = user.roles[0] || 'BUYER';

    switch (primaryRole) {
      case 'ADMIN':
        return <PlaceholderDashboard role="Admin" />; // <AdminDashboard user={user} />;
      case 'SELLER':
        return <PlaceholderDashboard role="Seller" />; // <SellerDashboard user={user} />;
      case 'LENDER':
        return <PlaceholderDashboard role="Lender" />; // <LenderDashboard user={user} />;
      case 'BUYER':
        return <PlaceholderDashboard role="Buyer" />; // <BuyerDashboard user={user} />;
      default:
        return <PlaceholderDashboard role="User" />;
    }
  };

  return (
    <div>
      {/* This is where a main layout with Sidebar/Navbar would wrap the content */}
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;