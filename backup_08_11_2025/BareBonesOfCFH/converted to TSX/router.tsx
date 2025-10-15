// ----------------------------------------------------------------------
// File: router.tsx
// Path: frontend/src/router/router.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The central router configuration for the entire frontend application.
// It defines all application routes and enforces security and performance standards.
//
// @usage
// This router object is imported into the main `App.tsx` and used with
// the <RouterProvider> component from 'react-router-dom'.
//
// @architectural_notes
// - **Protected Routes**: All sensitive routes are wrapped in the `<ProtectedRoute>`
//   component to enforce authentication and role-based access control (RBAC).
// - **Code Splitting**: All page-level components are loaded using `React.lazy()`.
//   This is our standard for performance, as it ensures the code for a page
//   is only downloaded when the user actually navigates to it.
//
// ----------------------------------------------------------------------

import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// --- ARCHITECTURAL UPGRADE: Lazy Loading for All Pages ---
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Login = React.lazy(() => import('@/pages/Login'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));
const SellerDashboard = React.lazy(() => import('@/pages/seller/SellerDashboard'));
// ... import other pages lazily

// --- ARCHITECTURAL UPGRADE: Protected Route Component for AuthN & AuthZ ---
const useAuth = () => {
  // In a real app, this hook would get user state from context or a library
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { isAuthenticated: !!user, role: user?.role };
};

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(role)) {
    // In a real app, you would render a dedicated "Access Denied" page
    return <div>Access Denied: You do not have permission to view this page.</div>;
  }

  return <Outlet />; // Render the child route
};

const PageLoader: React.FC = () => (
  <div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Public Routes
      { path: 'login', element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      
      // Authenticated Routes (all users)
      {
        element: <ProtectedRoute allowedRoles={['admin', 'seller', 'buyer', 'hauler']} />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><Dashboard /></Suspense> },
        ]
      },

      // Admin-Only Routes
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
          // ... other admin routes
        ]
      },

      // Seller-Only Routes
      {
        path: 'seller',
        element: <ProtectedRoute allowedRoles={['seller', 'admin']} />, // Admins can often access other roles' pages
        children: [
          { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><SellerDashboard /></Suspense> },
          // ... other seller routes
        ]
      },
    ],
  },
]);

export default router;