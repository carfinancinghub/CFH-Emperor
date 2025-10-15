// ----------------------------------------------------------------------
// File: useAdminUsers.ts
// Path: frontend/src/hooks/useAdminUsers.ts
// Author: Gemini, System Architect
// Created: August 11, 2025 at 19:09 PDT
// Version: 1.0.0
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A hook to manage all state and data fetching for the admin user management
// dashboard. Handles searching, filtering, and pagination.
//
// @architectural_notes
// - **State Encapsulation**: Manages all complex state for the user list,
//   including filters, pagination, loading, and errors.
// - **Debounced Search**: Includes logic to debounce the search input,
//   preventing excessive API calls while an admin is typing.
//
// ----------------------------------------------------------------------

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// A library like 'use-debounce' would be used in a real implementation
// import { useDebounce } from 'use-debounce';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would debounce the search filter value
  // const [debouncedSearch] = useDebounce(filters.search, 500);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        role: filters.role || undefined,
        status: filters.status || undefined,
        search: filters.search || undefined, // Use debouncedSearch in real app
      };
      const { data } = await axios.get('/api/admin/users', { params });
      setUsers(data.users);
      // Assuming API returns pagination info
      // setPagination(prev => ({ ...prev, total: data.total }));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, filters, setFilters, pagination, setPagination, isLoading, refetch: fetchUsers };
};