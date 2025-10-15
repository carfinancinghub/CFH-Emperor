// File: ManageListings.test.tsx
// Path: frontend/src/pages/seller/__tests__/ManageListings.test.tsx
// Purpose: Tests the dedicated hub for managing seller listings.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ManageListings from '../ManageListings';

// --- Mocks ---
const mockUseManageableListings = jest.fn();
jest.mock('../ManageListings', () => ({
  ...jest.requireActual('../ManageListings'),
  __esModule: true,
  useManageableListings: () => mockUseManageableListings(),
}));

describe('ManageListings Component', () => {

  const mockLaunchAuction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <ManageListings />
      </MemoryRouter>
    );
  };
  
  test('should display a list of cars and their statuses from the hook', () => {
    const mockListings = [
      { _id: 'car-1', year: 2024, make: 'Tesla', model: 'Cybertruck', price: 100000, status: 'Available' },
      { _id: 'car-2', year: 2023, make: 'Ford', model: 'F-150', price: 60000, status: 'In Auction' },
    ];
    mockUseManageableListings.mockReturnValue({ loading: false, listings: mockListings, launchAuction: mockLaunchAuction });
    renderComponent();

    expect(screen.getByText('2024 Tesla Cybertruck')).toBeInTheDocument();
    expect(screen.getByText('In Auction')).toBeInTheDocument();
  });

  test('should only show the "Launch Auction" button for "Available" cars', () => {
    const mockListings = [
      { _id: 'car-1', status: 'Available' },
      { _id: 'car-2', status: 'In Auction' },
    ];
    mockUseManageableListings.mockReturnValue({ loading: false, listings: mockListings, launchAuction: mockLaunchAuction });
    renderComponent();

    // Find the row for the "Available" car
    const availableCarRow = screen.getByText('Available').closest('tr');
    expect(within(availableCarRow!).getByRole('button', { name: /Launch Auction/i })).toBeInTheDocument();
    
    // Find the row for the "In Auction" car
    const inAuctionCarRow = screen.getByText('In Auction').closest('tr');
    expect(within(inAuctionCarRow!).queryByRole('button', { name: /Launch Auction/i })).not.toBeInTheDocument();
  });

  test('should call the launchAuction function from the hook when the button is clicked', () => {
    const mockListings = [{ _id: 'car-1', status: 'Available' }];
    mockUseManageableListings.mockReturnValue({ loading: false, listings: mockListings, launchAuction: mockLaunchAuction });
    renderComponent();

    const launchButton = screen.getByRole('button', { name: /Launch Auction/i });
    fireEvent.click(launchButton);

    expect(mockLaunchAuction).toHaveBeenCalledWith('car-1');
  });
});

// Helper from @testing-library/dom to scope queries within an element
import { within } from '@testing-library/dom';