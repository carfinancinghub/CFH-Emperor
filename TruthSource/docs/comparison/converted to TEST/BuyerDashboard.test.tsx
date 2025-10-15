// ----------------------------------------------------------------------
// File: BuyerDashboard.test.tsx
// Path: frontend/src/components/dashboards/__tests__/BuyerDashboard.test.tsx
// Author: Mini, System Architect
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------
//
// @description
// A test suite for the modular BuyerDashboard component.
//
// @architectural_notes
// - This test follows the exact same superior pattern as the SellerDashboard
//   test: mocking the data hook and child components to test the main
//   component's rendering logic in perfect isolation. This consistency is a
//   hallmark of our well-defined architecture.
//
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BuyerDashboard from '../BuyerDashboard';

// --- Mocks ---
const mockUseBuyerData = jest.fn();
// We can use a simplified mock for the imported ListingCard
jest.mock('../SellerDashboard', () => ({
  ListingCard: ({ listing, actions }: any) => (
    <div>
      <span>Listing: {listing.model}</span>
      {actions}
    </div>
  ),
}));

jest.mock('../BuyerDashboard', () => ({
  ...jest.requireActual('../BuyerDashboard'),
  __esModule: true,
  useBuyerData: () => mockUseBuyerData(),
}));

jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);

describe('BuyerDashboard Component', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display the loading spinner while data is being fetched', () => {
    mockUseBuyerData.mockReturnValue({ loading: true, activeListings: [], purchaseHistory: [] });
    render(<BuyerDashboard />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render a list of available listings from the hook', () => {
    const mockData = {
      loading: false,
      activeListings: [
        { _id: '3', make: 'Lucid', model: 'Air', year: 2025, price: 85000, status: 'Listed' },
      ],
      purchaseHistory: [],
    };
    mockUseBuyerData.mockReturnValue(mockData);
    render(<BuyerDashboard />);

    expect(screen.getByText('Available for Purchase')).toBeInTheDocument();
    expect(screen.getByText('Listing: Air')).toBeInTheDocument();
    // Check that the specific "Buy Now" button for the buyer is present
    expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
  });
});