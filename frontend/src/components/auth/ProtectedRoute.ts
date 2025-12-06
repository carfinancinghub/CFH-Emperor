// @ai-generated via ai-orchestrator
This file should be renamed to `ProtectedRoute.tsx`.

// File: ProtectedRoute.tsx
// Path: frontend/src/components/auth/ProtectedRoute.tsx

import React, { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// NOTE: For this component to be fully type-safe, the hook 
// './useAuth' must also be converted to TypeScript and define 
// the return type of { user, loading }.
import useAuth from './useAuth';

interface ProtectedRouteProps {
  // children must be explicitly typed as ReactNode (or JSX.Element, etc.)
  children: ReactNode;
}

// Use React.FC along with the defined props interface
const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  // Assuming useAuth returns { user: UserType | null, loading: boolean }
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  // 'user' is checked for truthiness (i.e., if it is defined and not null/false)
  if (!user) return <Navigate to="/login" />;

  // We return the children (ReactNode)
  return children;
};

export default ProtectedRoute;