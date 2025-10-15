// ----------------------------------------------------------------------
// File: DashboardPage.tsx
// Path: frontend/src/pages/DashboardPage.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A top-level page component that acts as a dispatcher, rendering the
// correct dashboard based on the authenticated user's role.
//
// @usage
// This component should be the target of the main '/' or '/dashboard' route
// within our protected routing structure.
//
// @architectural_notes
// - **Role-Based Dispatching**: This component's single responsibility is to
//   determine which user dashboard to show. This is a clean, scalable pattern.
// - **Performance via Code Splitting**: All role-specific dashboards are loaded
//   using React.lazy(). This is our standard for top-level pages to ensure
//   the initial application load is as fast as possible.
//
// ----------------------------------------------------------------------

// --- FUTURE ENHANCEMENTS (TODO) ---
// @free:
//   - [ ] Create a default view for users who may not have a specific role assigned, guiding them to their profile page.
// @premium:
//   - [ ] ✨ Add a "Quick Actions" widget to this page that shows the 2-3 most common actions for the user's role, allowing them to jump directly to a task.
// @wow:
//   - [ ] 🚀 Implement an AI-powered "Next Best Action" prompt that analyzes user behavior and suggests a specific, personalized action upon login (e.g., "Your auction for the Ford F-150 has new bids. View them now.").

import React, { Suspense } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth'; // Our standard auth hook

// --- Lazy-loaded Dashboard Components ---
const SellerDashboard = React.lazy(() => import('@/components/dashboards/SellerDashboard'));
const BuyerDashboard = React.lazy(() => import('@/components/dashboards/BuyerDashboard'));
// ... lazy load other dashboards like AdminDashboard, HaulerDashboard etc.

const DashboardPage: React.FC = () => {
  const { user } = useAuth(); // Assumes useAuth() returns the user object with a 'role'

  const renderDashboardByRole = () => {
    switch (user?.role) {
      case 'seller':
        return <SellerDashboard />;
      case 'buyer':
        return <BuyerDashboard />;
      // case 'admin':
      //   return <AdminDashboard />;
      default:
        return <div>Welcome! Please select a role to get started.</div>;
    }
  };

  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        {renderDashboardByRole()}
      </Suspense>
    </div>
  );
};

export default DashboardPage;