// ----------------------------------------------------------------------
// File: DisputeDashboard.tsx
// Path: frontend/src/pages/disputes/DisputeDashboard.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:48 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The main page for a user to view and manage their disputes.
//
// @architectural_notes
// - **Decoupled Data Logic**: All API calls and state management are encapsulated
//   in the `useDisputes` hook, keeping the component clean and presentational.
//
// @todos
// - @free:
//   - [ ] Add a button to "Create New Dispute" which would open a form.
// - @premium:
//   - [ ] ✨ Add real-time status updates for disputes using WebSockets.
// - @wow:
//   - [ ] 🚀 Integrate a real-time chat feature directly into the dispute view, allowing parties to communicate.
//
// ----------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IDispute } from '@/types';

// --- Decoupled Data & Logic Hook ---
const useDisputes = () => {
  const [disputes, setDisputes] = React.useState<IDispute[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');
  
  React.useEffect(() => {
    axios.get('/api/disputes/my-history', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDisputes(res.data))
      .catch(() => toast.error('Failed to load disputes.'))
      .finally(() => setLoading(false));
  }, [token]);
  
  return { disputes, loading };
};

// --- Main Component ---
const DisputeDashboard: React.FC = () => {
  const { disputes, loading } = useDisputes();

  if (loading) return <div>Loading disputes...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Disputes</h1>
      <div className="space-y-4">
        {disputes.map(dispute => (
          <div key={dispute._id} className="p-4 border rounded shadow-sm">
            <Link to={`/disputes/${dispute._id}`} className="text-xl font-semibold hover:underline">
              Dispute #{dispute._id}
            </Link>
            <p className="text-sm text-gray-500">Status: {dispute.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisputeDashboard;