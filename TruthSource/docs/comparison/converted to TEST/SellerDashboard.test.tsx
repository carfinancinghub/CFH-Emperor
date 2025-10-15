// ----------------------------------------------------------------------
// File: SellerDashboard.test.tsx
// Path: frontend/src/pages/seller/__tests__/SellerDashboard.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:25 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SellerDashboard from '../SellerDashboard';

// Mock the custom hook
const mockUseSellerDashboard = jest.fn();
jest.mock('../SellerDashboard', () => ({
  ...jest.requireActual('../SellerDashboard'),
  __esModule: true,
  useSellerDashboard: () => mockUseSellerDashboard(),
}));

describe('SellerDashboard Component', () => {
  it('should display a list of listings provided by the hook', () => {
    const mockListings = [
      { _id: '1', make: 'Tesla', model: 'Model S', year: 2024, price: 75000, status: 'Listed' },
    ];
    mockUseSellerDashboard.mockReturnValue({ loading: false, listings: mockListings });
    
    render(<MemoryRouter><SellerDashboard /></MemoryRouter>);
    
    expect(screen.getByText('Tesla Model S')).toBeInTheDocument();
    expect(screen.getByText('Listed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Edit/i })).toBeInTheDocument();
  });
});