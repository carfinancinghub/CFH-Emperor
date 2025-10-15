// ----------------------------------------------------------------------
// File: ContractDashboard.tsx
// Path: frontend/src/pages/contracts/ContractDashboard.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 10:45 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The definitive, unified dashboard for users to view and manage all their
// legal contracts across all roles.
//
// @architectural_notes
// - **Consolidated UI**: This component replaces multiple older, role-specific
//   views, creating a single, maintainable source of truth for the contracts UI.
// - **Decoupled Data Logic**: All API calls and state management are encapsulated
//   in the `useContracts` hook, adhering to our core architectural standard.
//
// @todos
// - @free:
//   - [ ] Add filtering and sorting options to the contract list (e.g., by status or date).
// - @premium:
//   - [ ] ✨ Allow users to download their contracts as a signed PDF.
// - @wow:
//   - [ ] 🚀 Implement a "Contract Analyzer" feature that uses AI to scan a contract and provide a human-readable summary of its key terms and obligations.
//
// ----------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IContract } from '@/types';

// --- Decoupled Data & Logic Hook ---
const useContracts = () => {
  const [contracts, setContracts] = React.useState<IContract[]>([]);
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('token');
  
  React.useEffect(() => {
    axios.get('/api/contracts/my-contracts', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setContracts(res.data))
      .catch(() => toast.error('Failed to load contracts.'))
      .finally(() => setLoading(false));
  }, [token]);
  
  return { contracts, loading };
};

// --- Main Component ---
const ContractDashboard: React.FC = () => {
  const { contracts, loading } = useContracts();

  if (loading) return <div>Loading contracts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Contracts</h1>
      <div className="space-y-4">
        {contracts.map(contract => (
          <div key={contract._id} className="p-4 border rounded shadow-sm">
            <Link to={`/contracts/${contract._id}`} className="text-xl font-semibold hover:underline">
              Contract #{contract._id}
            </Link>
            <p className="text-sm text-gray-500">Status: {contract.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractDashboard;