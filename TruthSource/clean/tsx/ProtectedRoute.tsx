// Converted from ProtectedRoute.jsx — 2025-08-22T11:57:25.466103+00:00
// File: ProtectedRoute.js
// Path: frontend/src/components/auth/ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@/utils/useAuth'; // ✅

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
