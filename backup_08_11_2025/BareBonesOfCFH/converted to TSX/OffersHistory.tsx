// ----------------------------------------------------------------------
// File: OffersHistory.tsx
// Path: frontend/src/features/offers/OffersHistory.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A clean, modular component for sellers to view the history of offers
// made on their vehicles.
//
// @architectural_notes
// - **Decoupled Data Logic**: All API calls and state management are now
//   encapsulated in the `useOffersHistory` hook.
// - **Standardized Styling**: All inline 'style' objects have been replaced
//   with our standard utility-class framework.
// - **Modular & Reusable UI**: The UI has been upgraded to use a clean table
//   layout and a dedicated `<OfferRow />` sub-component.
//
// @todos
// - @free:
//   - [ ] Add filtering and sorting options to the history table (e.g., sort by amount, filter by status).
// - @premium:
//   - [ ] ✨ Add the ability for sellers to directly accept, reject, or counter-offer from this history table.
// - @wow:
//   - [ ] 🚀 Implement an AI-powered "Offer Strength Indicator" that analyzes the offer against market data to give the seller an instant quality score.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// --- Type Definitions ---
interface IOffer {
  _id: string;
  carId: string;
  buyer: string;
  amount: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
}

// --- Decoupled Data & Logic Hook ---
const useOffersHistory = (sellerId: string) => {
  const [offers, setOffers] = React.useState<IOffer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    axios.get<IOffer[]>(`/api/offers/seller/${sellerId}`)
      .then(response => setOffers(response.data))
      .catch(() => setError('Failed to load offers.'))
      .finally(() => setLoading(false));
  }, [sellerId]);
  
  return { offers, loading, error };
};

// --- Modular & Reusable UI Component ---
const OfferRow: React.FC<{ offer: IOffer }> = ({ offer }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.carId}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{offer.buyer}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${offer.amount.toLocaleString()}</td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
        ${offer.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {offer.status}
      </span>
    </td>
  </tr>
);

// --- The Main Component ---
const OffersHistory: React.FC = () => {
  const sellerId = localStorage.getItem('userId') || '';
  const { offers, loading, error } = useOffersHistory(sellerId);
  
  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Offers History</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {offers.map(offer => <OfferRow key={offer._id} offer={offer} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersHistory;