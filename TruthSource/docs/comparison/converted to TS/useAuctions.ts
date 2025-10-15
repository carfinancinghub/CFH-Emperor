// ----------------------------------------------------------------------
// File: useAuctions.ts
// Path: frontend/src/hooks/useAuctions.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:30 PDT
// Version: 1.0.1 (Manages Filter State for Dynamic Searching)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
// @description Hook to fetch auctions with support for dynamic filtering.
// ----------------------------------------------------------------------
import { useState, useEffect } from 'react';
import axios from 'axios';

export interface AuctionFilters {
  make?: string;
  model?: string;
  yearMin?: number | string;
  yearMax?: number | string;
  maxPrice?: number | string;
}

export const useAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AuctionFilters>({});

  useEffect(() => {
    const fetchAuctions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            params.append(key, String(value));
          }
        });
        
        const res = await axios.get(`/api/v1/auctions?${params.toString()}`);
        setAuctions(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch auctions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuctions();
  }, [filters]);

  return { auctions, isLoading, error, filters, setFilters };
};