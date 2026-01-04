// @ai-generated via ai-orchestrator
// File: ProtectedRoute.tsx
// Path: frontend/src/components/auth/ProtectedRoute.tsx
// Purpose: Guard routes that require an authenticated user.
// Notes: This file is TSX because it returns JSX.

import React, { type FC, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, redirectTo = "/login" }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
