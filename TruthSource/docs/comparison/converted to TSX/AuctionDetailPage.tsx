// ----------------------------------------------------------------------
// File: AuctionDetailPage.tsx
// Path: frontend/src/pages/AuctionDetailPage.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 13, 2025 at 17:45 PDT
// Version: 1.0.8 (Added Seller Reputation & Comment Block)
// ----------------------------------------------------------------------
// @description
// Page for viewing auction details, bidding, contacting sellers, and displaying seller reputation.
//
// @architectural_notes
// - **Real-Time**: Uses WebSocket for live bid updates.
// - **Accessible**: Includes ARIA attributes for buttons.
// - **Reputation**: Displays seller’s `reputationScore` for trust.
//
// @dependencies react react-router-dom @hooks/useAuctionDetails @hooks/useAuth @hooks/useWatchlist axios socket.io-client
//
// @todos
// - @free:
//   - [x] Implement bidding and contact features.
//   - [x] Add watchlist and reputation display.
// - @premium:
//   - [ ] ✨ Support auto-bidding feature.
// - @wow:
//   - [ ] 🚀 Add live auction video streaming.
// ----------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuctionDetails } from '@hooks/useAuctionDetails';
import { useAuth } from '@hooks/useAuth';
import { useWatchlist } from '@hooks/useWatchlist';
import axios from 'axios';
import io from 'socket.io-client';

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

const PhotoGallery = ({ photos }: { photos: { url: string }[] }) => (
  <div className="grid grid-cols-1 gap-4">
    {photos.map((photo, index) => (
      <img key={index} src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-64 object-cover rounded-md" />
    ))}
  </div>
);

const ListingInfo = ({ listing }: { listing: { make: string; model: string; year: number; description: string; seller: { name: string; reputationScore: number } } }) => (
  <div className="p-4 bg-gray-50 rounded-md">
    <h2 className="text-xl font-bold">{listing.year} {listing.make} {listing.model}</h2>
    <p className="text-gray-600">{listing.description}</p>
    <p className="text-sm text-gray-500">Seller: {listing.seller?.name || 'Unknown'} ({listing.seller?.reputationScore?.toFixed(1) || '0.0'} ★)</p>
  </div>
);

const BiddingForm = ({ placeBid, isPlacingBid, bidError }: { placeBid: (amount: number) => void; isPlacingBid: boolean; bidError: string | null }) => {
  const [amount, setAmount] = useState('');
  return (
    <div className="p-4 bg-gray-50 rounded-md mt-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter bid amount"
        className="p-2 border rounded w-full"
      />
      {bidError && <p className="text-red-600">{bidError}</p>}
      <button
        onClick={() => placeBid(Number(amount))}
        disabled={isPlacingBid}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
      >
        {isPlacingBid ? 'Placing Bid...' : 'Place Bid'}
      </button>
    </div>
  );
};

const AdminActions = ({ auctionId }: { auctionId: string }) => {
  const [isFinalizing, setIsFinalizing] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.roles.includes('ADMIN')) return null;

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      const { data } = await axios.post(`/api/v1/transactions/finalize/${auctionId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate(`/transactions/${data.data._id}`);
    } catch (error: any) {
      alert(`Failed to finalize transaction: ${error.response?.data?.message || 'Unknown error'}`);
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg" aria-label="Admin Actions">
      <h3 className="text-lg font-bold text-yellow-800">Admin Actions</h3>
      <p className="text-sm text-yellow-700 mt-1">This panel is visible to administrators only.</p>
      <button
        onClick={handleFinalize}
        disabled={isFinalizing}
        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
        aria-label="Finalize Transaction"
      >
        {isFinalizing ? 'Finalizing...' : 'Finalize Transaction'}
      </button>
    </div>
  );
};

const ContactSellerButton = ({ listingId }: { listingId: string | null }) => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleContact = async () => {
    if (!listingId) return;
    setIsCreating(true);
    try {
      const res = await axios.post('/api/v1/conversations', { listingId });
      navigate(`/inbox/${res.data._id}`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to start conversation.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={isCreating}
      className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
    >
      {isCreating ? 'Starting...' : 'Contact Seller'}
    </button>
  );
};

const AuctionDetailPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { auction: initialAuction, isLoading, error, isPlacingBid, bidError, placeBid } = useAuctionDetails(auctionId!);
  const [auction, setAuction] = useState(initialAuction);
  const bidIds = new Set(auction?.bids.map(b => b._id));

  useEffect(() => {
    if (initialAuction) {
      setAuction(initialAuction);
      bidIds.clear();
      initialAuction.bids.forEach(b => bidIds.add(b._id));
    }
  }, [initialAuction]);

  useEffect(() => {
    if (!auctionId) return;

    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
    socket.emit('join_auction', { auctionId });
    socket.on('new_bid', (newBid) => {
      setAuction((prevAuction) => {
        if (!prevAuction || bidIds.has(newBid._id)) return prevAuction;
        bidIds.add(newBid._id);
        axios.post('/api/v1/history/log', { 
          action: 'RECEIVE_BID_NOTIFICATION', 
          details: { auctionId, bidId: newBid._id } 
        }).catch(err => console.error('Failed to log notification:', err));
        return { ...prevAuction, bids: [...prevAuction.bids, newBid] };
      });
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
    });

    return () => {
      socket.emit('leave_auction', { auctionId });
      socket.disconnect();
    };
  }, [auctionId]);

  if (isLoading && !auction) return <div className="p-8 text-gray-600">Loading Auction Details...</div>;
  if (error || !auction) return <div className="p-8 text-red-600" role="alert">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8" aria-label="Auction Detail Page">
      <div className="relative">
        <WatchButton auctionId={auctionId!} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <PhotoGallery photos={auction.listing.photos} />
          </div>
          <div>
            <ListingInfo listing={auction.listing} />
            <BiddingForm placeBid={placeBid} isPlacingBid={isPlacingBid} bidError={bidError} />
            <ContactSellerButton listingId={auction.listing._id} />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold">Current Bids</h3>
        <ul className="mt-2 space-y-2">
          {auction.bids.map((bid) => (
            <li key={bid._id} className="p-3 bg-gray-50 rounded-md">
              <p><strong>Bidder:</strong> {bid.bidder.name} ({bid.bidder.reputationScore?.toFixed(1) || '0.0'} ★)</p>
              <p><strong>Amount:</strong> ${bid.amount.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </div>
      <AdminActions auctionId={auctionId!} />
    </div>
  );
};

export default AuctionDetailPage;