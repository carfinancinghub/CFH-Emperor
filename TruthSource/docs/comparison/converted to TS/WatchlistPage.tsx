// ----------------------------------------------------------------------
// File: WatchlistPage.tsx
// Path: frontend/src/pages/WatchlistPage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 11:24 PDT
// Version: 1.0.1 (Enhanced Empty State)
// ----------------------------------------------------------------------
// @description Page to display auctions on the user's watchlist.
// ----------------------------------------------------------------------
import React from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';

const AuctionCard = ({ auction }: { auction: any }) => (
  <div className="border rounded-lg p-4">
    <img src={auction.listing.photos[0]?.url || '/placeholder.png'} alt="Vehicle" className="w-full h-48 object-cover rounded" />
    <h3 className="text-lg font-bold mt-2">{auction.listing.year} {auction.listing.make} {auction.listing.model}</h3>
    <p className="text-gray-600">${auction.listing.price?.toLocaleString()}</p>
  </div>
);

const WatchlistPage = () => {
  const { watchlistItems, isLoading, error } = useWatchlist();

  if (isLoading) return <div className="p-4 text-gray-600">Loading watchlist...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>
      {watchlistItems.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">You are not watching any auctions yet.</p>
          <p className="text-gray-500 mt-2">Click the star icon on an auction to add it to your watchlist.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {watchlistItems.map((auction: any) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;