// ----------------------------------------------------------------------
// File: AuctionPage.test.tsx
// Path: frontend/src/pages/auctions/__tests__/AuctionPage.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 07:30 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionPage from '../AuctionPage';

// Mock the custom hook
const mockUseLiveAuction = jest.fn();
jest.mock('../AuctionPage', () => ({
  ...jest.requireActual('../AuctionPage'),
  __esModule: true,
  useLiveAuction: () => mockUseLiveAuction(),
}));

describe('AuctionPage Component', () => {
  it('should display the current bid from the hook', () => {
    const mockAuction = { title: 'Test Auction', currentBid: 1200, bids: [] };
    mockUseLiveAuction.mockReturnValue({ auction: mockAuction, placeBid: jest.fn() });
    
    render(<AuctionPage auctionId="auc-123" />);
    
    expect(screen.getByText('Current Bid: $1,200')).toBeInTheDocument();
  });
});