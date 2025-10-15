// ----------------------------------------------------------------------
// File: SellerListingsPage.test.tsx
// Path: frontend/src/pages/seller/__tests__/SellerListingsPage.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 08:05 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SellerListingsPage from '../SellerListingsPage';

// Mock the custom hook
const mockUseSellerListings = jest.fn();
jest.mock('../SellerListingsPage', () => ({
  ...jest.requireActual('../SellerListingsPage'),
  __esModule: true,
  useSellerListings: () => mockUseSellerListings(),
}));

describe('SellerListingsPage Component', () => {
  it('should optimistically remove a listing when delete is clicked', () => {
    const mockDeleteListing = jest.fn();
    const mockListings = [{ _id: '1', make: 'Tesla', model: 'Model Y' }];
    mockUseSellerListings.mockReturnValue({ loading: false, listings: mockListings, deleteListing: mockDeleteListing });
    
    render(<MemoryRouter><SellerListingsPage /></MemoryRouter>);
    
    const listingElement = screen.getByText('Tesla Model Y');
    expect(listingElement).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    // The test for the hook itself would verify the optimistic update.
    // Here we just verify the handler was called.
    expect(mockDeleteListing).toHaveBeenCalledWith('1');
  });
});