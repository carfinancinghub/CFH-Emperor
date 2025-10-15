// ----------------------------------------------------------------------
// File: useWatchlist.ts
// Path: frontend/src/hooks/useWatchlist.ts
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:23 PDT
// Version: 1.0.1 (Added Error Handling)
// ----------------------------------------------------------------------
// @description Hook and Context Provider for global watchlist state.
// ----------------------------------------------------------------------
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const WatchlistContext = createContext<any>(null);

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/v1/watchlist');
      setWatchlistItems(res.data);
      setWatchlistIds(new Set(res.data.map((item: any) => item._id)));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch watchlist');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const toggleWatchlist = async (auctionId: string) => {
    const isWatched = watchlistIds.has(auctionId);
    const newIds = new Set(watchlistIds);
    if (isWatched) {
      newIds.delete(auctionId);
    } else {
      newIds.add(auctionId);
    }
    setWatchlistIds(newIds);

    try {
      if (isWatched) {
        await axios.delete(`/api/v1/watchlist/${auctionId}`);
      } else {
        await axios.post(`/api/v1/watchlist/${auctionId}`);
      }
      await fetchWatchlist();
    } catch (err: any) {
      setWatchlistIds(new Set(watchlistIds));
      setError(err.response?.data?.error || 'Failed to update watchlist');
    }
  };

  const value = { watchlistIds, watchlistItems, isLoading, error, toggleWatchlist, fetchWatchlist };
  
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};

export const useWatchlist = () => useContext(WatchlistContext);