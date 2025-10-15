// ----------------------------------------------------------------------
// File: AuctionListPage.tsx
// Path: frontend/src/pages/AuctionListPage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 09:31 PDT
// Version: 1.0.5 (Added Seller Reputation & Comment Block)
// ----------------------------------------------------------------------
// @description
// Page to list auctions with advanced filtering, watchlist, and seller reputation display.
//
// @architectural_notes
// - **Dynamic**: Integrates `useAuctions` and `useWatchlist` for real-time data.
// - **Accessible**: `WatchButton` includes ARIA attributes for usability.
// - **Reputation**: Displays seller’s `reputationScore` for trust.
//
// @dependencies react @hooks/useAuctions @hooks/useWatchlist lodash zod
//
// @todos
// - @free:
//   - [x] Implement filtering and watchlist.
//   - [x] Add seller reputation display.
// - @premium:
//   - [ ] ✨ Support saved search alerts.
// - @wow:
//   - [ ] 🚀 Add AI-driven auction recommendations.
// ----------------------------------------------------------------------
import React, { useState } from 'react';
import { useAuctions, AuctionFilters } from '@hooks/useAuctions';
import { useWatchlist } from '@hooks/useWatchlist';
import { debounce } from 'lodash';
import { z } from 'zod';

const FilterSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.coerce.number().int().min(1900).optional(),
  yearMax: z.coerce.number().int().max(new Date().getFullYear() + 1).optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

const WatchButton = ({ auctionId }: { auctionId: string }) => {
  const { watchlistIds, toggleWatchlist } = useWatchlist();
  const isWatched = watchlistIds.has(auctionId);
  return (
    <button
      onClick={() => toggleWatchlist(auctionId)}
      className="absolute top-2 right-2 p-1 bg-white rounded-full"
      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
      data-testid={`watch-button-${auctionId}`}
    >
      <svg className={`w-6 h-6 ${isWatched ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
    </button>
  );
};

const AuctionCard = ({ auction }: { auction: any }) => (
  <div className="border rounded-lg p-4 relative" data-auction-id={auction._id}>
    <WatchButton auctionId={auction._id} />
    <img src={auction.listing.photos[0]?.url || '/placeholder.png'} alt="Vehicle" className="w-full h-48 object-cover rounded" />
    <h3 className="text-lg font-bold mt-2">{auction.listing.year} {auction.listing.make} {auction.listing.model}</h3>
    <p className="text-gray-600">${auction.listing.price?.toLocaleString()}</p>
    <p className="text-sm text-gray-500">Seller: {auction.seller?.name || 'Unknown'} ({auction.seller?.reputationScore?.toFixed(1) || '0.0'} ★)</p>
  </div>
);

const FilterSidebar = ({ onFilterChange, onReset }: { onFilterChange: (filters: AuctionFilters) => void; onReset: () => void }) => {
  const [localFilters, setLocalFilters] = useState<AuctionFilters>({});
  const debouncedOnChange = React.useCallback(debounce((filters: AuctionFilters) => {
    try {
      FilterSchema.parse(filters);
      onFilterChange(filters);
    } catch (err: any) {
      console.error('Invalid filter input:', err);
    }
  }, 500), [onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    debouncedOnChange(newFilters);
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="space-y-4">
        <input name="make" placeholder="Make (e.g., Ford)" value={localFilters.make || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="model" placeholder="Model (e.g., Mustang)" value={localFilters.model || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="yearMin" type="number" placeholder="Min Year" value={localFilters.yearMin || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="yearMax" type="number" placeholder="Max Year" value={localFilters.yearMax || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        <input name="maxPrice" type="number" placeholder="Max Price" value={localFilters.maxPrice || ''} onChange={handleChange} className="p-2 border rounded w-full" />
        <button onClick={onReset} className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Reset Filters</button>
      </div>
    </div>
  );
};

const AuctionListPage = () => {
  const { auctions, isLoading, error, setFilters } = useAuctions();

  const handleReset = () => {
    setFilters({});
  };

  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <FilterSidebar onFilterChange={setFilters} onReset={handleReset} />
      </div>
      <div className="md:col-span-3">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction: any) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionListPage;