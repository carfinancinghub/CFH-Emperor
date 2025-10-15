// ----------------------------------------------------------------------
// File: AdminUserManagerPage.tsx
// Path: frontend/src/pages/admin/AdminUserManagerPage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 13:50 PDT
// Version: 2.0.1 (Enhanced with Accessibility & Filters)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// UI for administrators to search, filter, and manage platform users, powered by useAdminUsers.
//
// @architectural_notes
// - **Component Composition**: Uses filter bar, user table, and pagination controls.
// - **Hook-Driven**: Relies on useAdminUsers for all logic.
// - **Accessible**: Includes ARIA attributes for inclusivity.
// - **Responsive**: Optimized with Tailwind CSS.
//
// @todos
// - @free:
//   - [x] Add filter controls and status actions.
// - @premium:
//   - [ ] ✨ Add exportable user reports.
// - @wow:
//   - [ ] 🚀 Display AI-driven user risk scores.
//
// ----------------------------------------------------------------------
import React from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';

interface IUser {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  serviceProviderProfile?: { _id: string };
}

const AdminUserManagerPage = () => {
  const { users, meta, filters, setFilters, isLoading, error, updateStatus, setMeta } = useAdminUsers();

  const handleStatusChange = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : currentStatus === 'SUSPENDED' ? 'BANNED' : 'ACTIVE';
    updateStatus(userId, newStatus);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen" aria-label="User Management Dashboard">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">User Management</h1>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Filter Controls */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="p-2 border rounded w-full focus:ring-indigo-500"
              aria-describedby="search-description"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={filters.role}
              onChange={e => setFilters(prev => ({ ...prev, role: e.target.value }))}
              className="p-2 border rounded w-full focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="p-2 border rounded w-full focus:ring-indigo-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-600">Loading users...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200" role="grid">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user: IUser) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name} ({user.email})</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.roles.join(', ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleStatusChange(user._id, user.status)}
                        className="text-indigo-600 hover:text-indigo-900"
                        aria-label={`Change status for ${user.name}`}
                      >
                        {user.status === 'ACTIVE' ? 'Suspend' : user.status === 'SUSPENDED' ? 'Ban' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-700">Showing {users.length} of {meta.total} results</p>
          <div className="space-x-2">
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={meta.page <= 1}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50 focus:ring-indigo-500"
              aria-label="Previous page"
            >
              Prev
            </button>
            <button
              onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={meta.page * meta.limit >= meta.total}
              className="px-4 py-2 bg-white border rounded disabled:opacity-50 focus:ring-indigo-500"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagerPage;