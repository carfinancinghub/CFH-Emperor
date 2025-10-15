// ----------------------------------------------------------------------
// File: App.tsx
// Path: frontend/src/App.tsx
// Author: Gemini & SG Man, System Architects
// Created: August 15, 2025 at 10:58 PDT
// Version: 1.0.3 (Initialized Notification Subscription)
// ----------------------------------------------------------------------
// @description Main app component with routing, watchlist, and notifications.
// @dependencies @pages/ProfilePage @pages/WatchlistPage @pages/AuctionListPage @pages/MessagingInbox @pages/AuctionDetailPage @hooks/useWatchlist @hooks/useNotifications
// ----------------------------------------------------------------------
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfilePage from '@pages/ProfilePage';
import WatchlistPage from '@pages/WatchlistPage';
import AuctionListPage from '@pages/AuctionListPage';
import MessagingInbox from '@pages/MessagingInbox';
import AuctionDetailPage from '@pages/AuctionDetailPage';
import { WatchlistProvider } from '@hooks/useWatchlist';
import { useNotifications } from '@hooks/useNotifications';

const App = () => {
  useNotifications();

  return (
    <WatchlistProvider>
      <Router>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold" aria-label="CFH Home">CFH</Link>
            <div className="space-x-4">
              <Link to="/auctions" aria-label="View Auctions">Auctions</Link>
              <Link to="/inbox" aria-label="View Messages">Messages</Link>
              <Link to="/watchlist" aria-label="View Watchlist">My Watchlist</Link>
              <Link to="/profile" aria-label="View Profile">Profile</Link>
            </div>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<AuctionListPage />} />
            <Route path="/auctions" element={<AuctionListPage />} />
            <Route path="/auctions/:auctionId" element={<AuctionDetailPage />} />
            <Route path="/inbox" element={<MessagingInbox />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
      </Router>
    </WatchlistProvider>
  );
};

export default App;