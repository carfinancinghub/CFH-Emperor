// File: SellerViewListings.test.tsx
// Path: frontend/src/components/seller/__tests__/SellerViewListings.test.tsx
// Purpose: Tests the hook-based SellerViewListings component.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';
import SellerViewListings from '../SellerViewListings';

// --- Mocks ---
// This is the key: We mock the entire module and then selectively override the hooks.
const mockUseSellerListing = jest.fn();
jest.mock('../SellerViewListings', () => ({
  ...jest.requireActual('../SellerViewListings'), // Import the actual component
  __esModule: true,
  // Override the hook with our mock function
  useSellerListing: () => mockUseSellerListing(),
}));

// Mock child components
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));


describe('SellerViewListings Component', () => {

  const mockDeleteListing = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to render the component with a specific route to provide the `id` param
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/seller/listings/car-123']}>
        <Routes>
          <Route path="/seller/listings/:id" element={<SellerViewListings />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('should display loading state provided by the hook', () => {
    mockUseSellerListing.mockReturnValue({ loading: true, car: null, deleteListing: mockDeleteListing });
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display "not found" message when hook returns no car', () => {
    mockUseSellerListing.mockReturnValue({ loading: false, car: null, deleteListing: mockDeleteListing });
    renderComponent();
    expect(screen.getByText('Listing not found.')).toBeInTheDocument();
  });
  
  test('should render car details when provided by the hook', () => {
    const mockCar = {
      _id: 'car-123', year: 2024, make: 'Lucid', model: 'Air', status: 'Listed',
      price: 85000, createdAt: new Date().toISOString()
    };
    mockUseSellerListing.mockReturnValue({ loading: false, car: mockCar, deleteListing: mockDeleteListing });
    renderComponent();

    expect(screen.getByText('2024 Lucid Air')).toBeInTheDocument();
    expect(screen.getByText('$85,000')).toBeInTheDocument();
  });

  test('should call the deleteListing function from the hook when delete button is clicked', () => {
    const mockCar = { _id: 'car-123', year: 2024, make: 'Lucid', model: 'Air', status: 'Listed', price: 85000, createdAt: new Date().toISOString() };
    mockUseSellerListing.mockReturnValue({ loading: false, car: mockCar, deleteListing: mockDeleteListing });
    renderComponent();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);
    
    expect(mockDeleteListing).toHaveBeenCalledTimes(1);
  });
});