// Converted from RoleSwitchWrapper.js — 2025-08-22T11:57:30.478839+00:00
// File: RoleSwitchWrapper.js
// Path: frontend/src/components/RoleSwitchWrapper.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import RoleRouter from '../router/RoleRouter';
import useAuth from './useAuth';
import LoadingSpinner from './LoadingSpinner';

const RoleSwitchWrapper = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user?.role) return <Navigate to="/login" replace />;

  return <RoleRouter role={user.role} />;
};

export default RoleSwitchWrapper;
