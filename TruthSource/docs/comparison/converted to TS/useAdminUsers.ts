// ----------------------------------------------------------------------
// File: useAdminUsers.ts
// Path: frontend/src/hooks/useAdminUsers.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 13:50 PDT
// Version: 2.0.1 (Enhanced with Types & Errors)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Hook for the Admin User Management page, handling user list fetching, filtering, and status updates.
//
// @architectural_notes
// - **Full State Management**: Manages users, pagination, filters, loading, and error states.
// - **Action-Oriented**: Provides async functions for status updates with refetching.
// - **Secure**: Uses auth token for API calls.
// - **Validated**: Applies client-side filter validation.
//
// @todos
// - @free:
//   - [x] Fetch and filter users with pagination.
// - @premium:
//   - [ ] ✨ Persist filters in local storage.
// - @wow:
//   - [ ] 🚀 Integrate AI-driven user analytics.
//
// ----------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

interface IUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  serviceProviderProfile?: { _id: string };
}

const FilterSchema = z.object({
  role: z.string().optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'BANNED', '']).optional(),
  search: z.string().optional(),
});

export const useAdminUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0 });
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!user?.token) {
      setError('You must be logged in as an admin.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const validatedFilters = FilterSchema.parse(filters);
      const params = {
        page: meta.page,
        limit: meta.limit,
        ...validatedFilters,
      };
      const { data } = await axios.get<{ data: IUser[]; meta: { page: number; limit: number; total: number } }>(
        '/api/admin/users',
        { params, headers: { Authorization: `Bearer ${user.token}` } }
      );
      setUsers(data.data);
      setMeta(data.meta);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, meta.page, meta.limit, user?.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateStatus = async (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED' | 'BANNED') => {
    if (!user?.token) {
      setError('You must be logged in as an admin.');
      return;
    }
    try {
      await axios.patch(`/api/admin/users/${userId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update status for user ${userId}.`);
    }
  };

  return { users, meta, filters, setFilters, isLoading, error, updateStatus, setMeta };
};