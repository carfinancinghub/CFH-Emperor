// @ai-generated via ai-orchestrator
This conversion uses idiomatic TypeScript features like interfaces for data structures and props, explicit typing for `useState` hooks, and proper typing for React event handlers, while preserving the existing JSX structure and functionality.

### `BuyerBidHistory.tsx`

```tsx
/**
 * BuyerBidHistory.tsx
 * Path: frontend/src/components/buyer/BuyerBidHistory.tsx
 * Purpose: Display buyer's past auction bid history with filtering by status.
 * 👑 Cod2 Crown Certified
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

// --- Type Definitions ---

// Define possible bid statuses (including the 'All' filter option)
type BidStatusFilter = 'All' | 'Won' | 'Lost' | 'Pending';
type BidStatus = Exclude<BidStatusFilter, 'All'>;

interface Car {
  make: string;
  model: string;
  year: number;
}

interface Bid {
  id: string; // Use string for ID based on common API practices
  status: BidStatus;
  amount: number;
  createdAt: string; // ISO date string
  car?: Car; // Assuming car details are nested
}

interface BuyerBidHistoryProps {
  buyerId: string;
}

// ------------------------

const BuyerBidHistory: React.FC<BuyerBidHistoryProps> = ({ buyerId }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BidStatusFilter>('All');

  // Fetch bid history
  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view bid history');
          setLoading(false);
          toast.error('Authentication required');
          return;
        }

        const response = await axios.get<Bid[]>(`/api/buyer/${buyerId}/bid-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure data is treated as an array of Bids
        setBids(response.data || []);
        setLoading(false);
      } catch (err) {
        // Use type assertion or check if it's an Axios error if handling deeply
        const errorMessage = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message || 'Failed to load bid history'
          : 'An unexpected error occurred';
        
        setError(errorMessage);
        setLoading(false);
        toast.error('Error loading bid history');
      }
    };

    fetchBids();
  }, [buyerId]);

  // Filter bids by status
  const filteredBids: Bid[] =
    filter === 'All'
      ? bids
      : bids.filter((bid) => bid.status === filter);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Type assertion is safe here as options are hardcoded BidStatusFilters
    setFilter(e.target.value as BidStatusFilter);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bid History</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          
          {/* Filter Dropdown */}
          <div className="mb-4">
            <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 mr-2">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filter}
              onChange={handleFilterChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              aria-label="Filter bids by status"
            >
              <option value="All">All</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          
          {filteredBids.length === 0 ? (
            <div className="text-gray-500 text-center py-4">
              No bids found for this filter. Start bidding to build your history! 🏷️
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-gray-600">Car</th>
                    <th className="px-4 py-2 text-left text-gray-600">Bid Amount</th>
                    <th className="px-4 py-2 text-left text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBids.map((bid) => (
                    <tr
                      key={bid.id}
                      className="border-b hover:bg-gray-50 animate-fadeIn"
                    >
                      <td className="px-4 py-2 text-gray-700">
                        {bid.car?.make} {bid.car?.model} ({bid.car?.year})
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        ${bid.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            bid.status === 'Won'
                              ? 'bg-green-100 text-green-700'
                              : bid.status === 'Lost'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {bid.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}
      </style>
    </ErrorBoundary>
  );
};

export default BuyerBidHistory;
```