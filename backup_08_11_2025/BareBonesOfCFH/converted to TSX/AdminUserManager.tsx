// ----------------------------------------------------------------------
// File: AdminUserManager.tsx
// Path: frontend/src/pages/admin/AdminUserManager.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The primary user interface for administrators to manage all users on the
// platform, including promotions and suspensions.
//
// @architectural_notes
// - **Decoupled Data Logic**: All API calls and state management (users,
//   loading, error) are now encapsulated in the `useAdminUsers` hook. The
//   main component is now a clean, purely presentational UI layer.
// - **Optimistic UI Updates**: Actions like 'suspend' or 'promote'
//   immediately update the local UI for a fast, responsive experience,
//   with logic to revert the change if the API call fails.
//
// @todos
// - @free:
//   - [ ] Add pagination and search/filter controls to handle a large number of users.
// - @premium:
//   - [ ] ✨ Add a feature to view a user's detailed activity log directly from this table.
// - @wow:
//   - [ ] 🚀 Integrate an AI-powered "Risk Score" for each user, based on their behavior, to help admins proactively identify potential problem accounts.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/common/Button';

// --- Type Definitions ---
interface IUserForAdmin {
  _id: string;
  email: string;
  role: string;
  verified: boolean;
  judge: boolean;
  reputationScore: number;
  suspended: boolean;
}

// --- Decoupled Data & Logic Hook ---
const useAdminUsers = () => {
  const [users, setUsers] = React.useState<IUserForAdmin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(res.data);
    } catch (err) {
      toast.error('Unable to fetch users.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (action: 'promote' | 'suspend', userId: string) => {
    const originalUsers = [...users];
    
    // Optimistic UI Update
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, [action === 'promote' ? 'judge' : 'suspended']: true } : u));
    
    try {
      const endpoint = action === 'promote' ? `/api/admin/promote-judge/${userId}` : `/api/admin/suspend-user/${userId}`;
      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`User successfully ${action}d!`);
    } catch (err) {
      toast.error(`Failed to ${action} user.`);
      setUsers(originalUsers); // Revert on error
    }
  };

  return { users, loading, handleAction };
};

// --- The Main Component ---
const AdminUserManager: React.FC = () => {
  const { users, loading, handleAction } = useAdminUsers();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>
      <table className="min-w-full table-auto text-sm border">
        {/* Table Head */}
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Role</th>
            <th className="p-3 border">Suspended</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border capitalize">{user.role}</td>
              <td className="p-3 border">{user.suspended ? '🚫' : 'Active'}</td>
              <td className="p-3 border space-x-2">
                {!user.judge && <Button onClick={() => handleAction('promote', user._id)} size="sm">Promote to Judge</Button>}
                {!user.suspended && <Button onClick={() => handleAction('suspend', user._id)} size="sm" variant="destructive">Suspend</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManager;