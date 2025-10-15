// ----------------------------------------------------------------------
// File: AuctionPage.tsx
// Path: frontend/src/pages/auctions/AuctionPage.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:30 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// The main page for viewing and participating in a live auction, featuring
// real-time bid updates via WebSockets.
//
// @architectural_notes
// - **Real-Time UI**: The `useLiveAuction` hook subscribes to WebSocket events,
//   allowing the UI to update instantly when a new bid is placed without
//   requiring the user to refresh the page. This is our standard for live features.
// - **Decoupled Logic**: All API and WebSocket logic is encapsulated in the
//   hook, keeping the main component clean and focused on rendering the UI.
//
// @todos
// - @free:
//   - [ ] Display a countdown timer for the auction's end time.
// - @premium:
//   - [ ] ✨ Add a real-time chart that visualizes the bidding history as it happens.
// - @wow:
//   - [ ] 🚀 Integrate the AR/VR visualization data from the 'PredictiveAssistant' to create an immersive, augmented reality bidding experience.
//
// ----------------------------------------------------------------------

import React from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';
import { IAuction, IBid } from '@/types';

// --- Decoupled Data & Logic Hook ---
const useLiveAuction = (auctionId: string) => {
  const [auction, setAuction] = React.useState<IAuction | null>(null);
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    // Fetch initial auction state
    axios.get(`/api/auctions/${auctionId}`).then(res => setAuction(res.data));

    // Connect to WebSocket and join the auction room
    const socket: Socket = io({ query: { userId: localStorage.getItem('userId') } });
    socket.emit('joinRoom', `auction:${auctionId}`);

    // Listen for real-time updates
    socket.on('bid:new', (newBid: IBid) => {
      toast.info(`New bid: $${newBid.amount.toLocaleString()}`);
      setAuction(prev => prev ? { ...prev, bids: [...prev.bids, newBid], currentBid: newBid.amount } : null);
    });

    return () => { socket.disconnect(); };
  }, [auctionId]);
  
  const placeBid = async (amount: number) => {
    await axios.post(`/api/auctions/${auctionId}/bid`, { amount }, { headers: { Authorization: `Bearer ${token}` } });
  };

  return { auction, placeBid };
};

// --- Main Component ---
const AuctionPage: React.FC<{ auctionId: string }> = ({ auctionId }) => {
  const { auction, placeBid } = useLiveAuction(auctionId);
  const [bidAmount, setBidAmount] = React.useState(0);

  if (!auction) return <div>Loading auction...</div>;
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{auction.title}</h1>
      <p className="text-4xl font-bold my-4">Current Bid: ${auction.currentBid.toLocaleString()}</p>
      
      <div>
        <input type="number" value={bidAmount} onChange={e => setBidAmount(parseInt(e.target.value, 10))} />
        <button onClick={() => placeBid(bidAmount)}>Place Bid</button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold">Bid History</h3>
        <ul>
          {auction.bids.map(bid => <li key={bid.timestamp.toString()}>${bid.amount.toLocaleString()}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default AuctionPage;