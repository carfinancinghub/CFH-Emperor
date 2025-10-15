// ----------------------------------------------------------------------
// File: useDashboard.ts
// Path: frontend/src/hooks/useDashboard.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 18:58 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A foundational hook to fetch the current authenticated user's data, which
// is used by the main dashboard to determine which role-specific UI to render.
//
// ----------------------------------------------------------------------

import { useState, useEffect } from 'react';
import axios from 'axios';

// A simplified User type for the frontend
interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  roles: ('BUYER' | 'SELLER' | 'LENDER' | 'INSURER' | 'ADMIN')[];
}

export const useDashboard = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // This endpoint should return the full profile of the logged-in user
        const { data } = await axios.get('/api/users/me'); 
        setUser(data);
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { user, isLoading, error };
};