// ----------------------------------------------------------------------
// File: useAuctionDetails.ts
// Path: frontend/src/hooks/useAuctionDetails.ts
// Author: Gemini & SG Man, System Architects
// Created: August 12, 2025 at 10:05 PDT
// Version: 1.0.1 (Enhanced with Types & Auth)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// Hook to fetch and manage state for a single auction, including bidding functionality.
//
// @architectural_notes
// - **Focused Data Fetching**: Fetches populated auction data from /api/v1/auctions/:auctionId.
// - **Action-Oriented**: Provides a secure placeBid function with auth headers.
// - **Type Safety**: Uses strict interfaces for auction and bid data.
// - **WebSocket Ready**: Placeholder for real-time bid updates.
//
// @todos
// - @premium:
//   - [ ] ✨ Add WebSocket listener for real-time bid updates.
// - @wow:
//   - [ ] 🚀 Integrate AI Bidding Assistant for suggested bid amounts.
//
// ----------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

interface Auction {
  _id: string;
  listing: {
    make: string;
    model: string;
    year: number;
    photos: { url: string; metadata: object }[];
    seller: { name: string; profile: { avatar: string }; reputation: number };
  };
  auctionType: 'SALE' | 'SERVICES' | 'SEALED_BID';
  endTime: string;
  status: 'ACTIVE';
  bids: { bidder: { name: string; businessName?: string; reputation: number }; amount: number; terms?: string }[];
}

export const useAuctionDetails = (auctionId: string) => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAuction = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get<{ data: Auction }>(`/api/v1/auctions/${auctionId}`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      setAuction(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch auction details.');
    } finally {
      setIsLoading(false);
    }
  }, [auctionId, user?.token]);

  useEffect(() => {
    if (auctionId) {
      fetchAuction();
    }
  }, [fetchAuction, auctionId]);

  const placeBid = async (bidData: { amount: number; terms?: string }) => {
    if (!user?.id) {
      setBidError('You must be logged in to place a bid.');
      return;
    }
    setIsPlacingBid(true);
    setBidError(null);
    try {
      await axios.post(`/api/v1/auctions/${auctionId}/bids`, bidData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      await fetchAuction();
      // TODO: @premium - Initialize WebSocket listener for real-time bid updates
    } catch (err: any) {
      setBidError(
        err.response?.status === 403
          ? 'Unauthorized to place bid.'
          : err.response?.data?.message || 'Failed to place bid.'
      );
    } finally {
      setIsPlacingBid(false);
    }
  };

  return { auction, isLoading, error, isPlacingBid, bidError, placeBid };
};