// ----------------------------------------------------------------------
// File: useTransactionDetails.ts
// Path: frontend/src/hooks/useTransactionDetails.ts
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 11:30 PDT
// Version: 1.0.0 (Initial Implementation)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Hook for fetching and managing detailed transaction data for a single transaction.
//
// @architectural_notes
// - **API Integration**: Fetches transaction details from /api/v1/transactions/:transactionId.
// - **State Management**: Handles transaction data, loading, and error states.
// - **Secure**: Uses auth token for admin-only access.
//
// @todos
// - @free:
//   - [x] Fetch transaction details.
// - @premium:
//   - [ ] ✨ Add PDF export for transaction details.
// - @wow:
//   - [ ] 🚀 Integrate AI fraud detection alerts.
//
// ----------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

interface ITransaction {
  _id: string;
  auction: { _id: string; listing: { make: string; model: string; year: number } };
  status: 'PENDING_SETTLEMENT' | 'SETTLED' | 'FAILED';
  totalSalePrice: number;
  totalServiceFees: number;
  platformCommission: number;
  payouts: { payee: { name: string }; amount: number; status: 'PENDING' | 'COMPLETED' | 'FAILED' }[];
}

export const useTransactionDetails = (transactionId: string) => {
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransaction = useCallback(async () => {
    if (!user?.token || !user.roles.includes('ADMIN')) {
      setError('Admin access required.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<{ data: ITransaction }>(`/api/v1/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransaction(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transaction details.');
    } finally {
      setIsLoading(false);
    }
  }, [transactionId, user?.token, user?.roles]);

  useEffect(() => {
    if (transactionId) {
      fetchTransaction();
    }
  }, [fetchTransaction, transactionId]);

  return { transaction, isLoading, error };
};