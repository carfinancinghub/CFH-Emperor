// Converted from ProtectedRoute.js — 2025-08-22T01:45:33.118798+00:00
// File: ProtectedRoute.js
// Path: frontend/src/components/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const role = user?.role || localStorage.getItem('role');

  if (loading) return <div>Loading...</div>;
  if (!user || (allowedRoles && !allowedRoles.includes(role))) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
