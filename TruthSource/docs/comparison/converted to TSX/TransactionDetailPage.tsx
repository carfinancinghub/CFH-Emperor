// ----------------------------------------------------------------------
// File: TransactionDetailPage.tsx
// Path: frontend/src/pages/TransactionDetailPage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 11:32 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Page for displaying detailed transaction information, powered by useTransactionDetails.
//
// @architectural_notes
// - **Presentational**: Relies on useTransactionDetails for logic.
// - **Responsive**: Uses Tailwind CSS for a clean, mobile-friendly UI.
// - **Accessible**: Includes ARIA attributes for inclusivity.
//
// @todos
// - @free:
//   - [x] Display transaction details.
// - @premium:
//   - [ ] ✨ Add PDF export button.
// - @wow:
//   - [ ] 🚀 Highlight AI-detected transaction anomalies.
//
// ----------------------------------------------------------------------
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTransactionDetails } from '@/hooks/useTransactionDetails';

interface ITransaction {
  _id: string;
  auction: { _id: string; listing: { make: string; model: string; year: number } };
  status: 'PENDING_SETTLEMENT' | 'SETTLED' | 'FAILED';
  totalSalePrice: number;
  totalServiceFees: number;
  platformCommission: number;
  payouts: { payee: { name: string }; amount: number; status: 'PENDING' | 'COMPLETED' | 'FAILED' }[];
}

const TransactionDetailPage = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { transaction, isLoading, error } = useTransactionDetails(transactionId!);

  if (isLoading) return <div className="p-8 text-gray-600">Loading transaction details...</div>;
  if (error || !transaction) return <div className="p-8 text-red-600" role="alert">{error}</div>;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen" aria-label="Transaction Detail Page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction {transaction._id}</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          <p><strong>Auction:</strong> {transaction.auction._id}</p>
          <p><strong>Vehicle:</strong> {transaction.auction.listing.year} {transaction.auction.listing.make} {transaction.auction.listing.model}</p>
          <p><strong>Status:</strong> 
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'SETTLED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {transaction.status}
            </span>
          </p>
          <p><strong>Total Sale Price:</strong> ${transaction.totalSalePrice.toFixed(2)}</p>
          <p><strong>Total Service Fees:</strong> ${transaction.totalServiceFees.toFixed(2)}</p>
          <p><strong>Platform Commission:</strong> ${transaction.platformCommission.toFixed(2)}</p>

          <h2 className="text-xl font-semibold mt-6 mb-4">Payouts</h2>
          <ul className="space-y-2">
            {transaction.payouts.map((payout, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md">
                <p><strong>Payee:</strong> {payout.payee.name}</p>
                <p><strong>Amount:</strong> ${payout.amount.toFixed(2)}</p>
                <p><strong>Status:</strong> {payout.status}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;