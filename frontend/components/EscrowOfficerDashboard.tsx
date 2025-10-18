/**
 * EscrowOfficerDashboard Component
 * --------------------------------
 * Path: frontend/components/EscrowOfficerDashboard.tsx
 *
 * Description:
 * - React functional component for escrow officers to view and manage escrow transactions.
 * - Fetches escrow transactions from the backend API on mount.
 * - Displays each transaction with ID, amount, status, and a "Release Funds" button.
 * - Uses Tailwind CSS for styling.
 *
 * TODO (Tier-based access):
 * - Integrate tier checks (free, premium, Wow ++) to restrict or enable actions.
 * - Only allow "Release Funds" for certain tiers or add confirmation dialogs.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import Navbar from './Navbar';

interface Transaction {
  _id: string;
  amount: number;
  status: string;
  // Add more fields as needed
}

const EscrowOfficerDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    axios
      .get<Transaction[]>('/api/payments/escrow')
      .then((res: { data: Transaction[] }) => setTransactions(res.data))
      .catch((): void => setTransactions([]));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Escrow Officer Dashboard</h1>
        <div className="grid gap-4">
          {transactions.length === 0 ? (
            <div className="text-gray-500">No transactions found.</div>
          ) : (
            transactions.map(tx => (
              <div key={tx._id} className="border p-4 rounded">
                <h2 className="text-lg">Transaction ID: {tx._id}</h2>
                <p>Amount: ${tx.amount}</p>
                <p>Status: {tx.status}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">
                  Release Funds
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EscrowOfficerDashboard;