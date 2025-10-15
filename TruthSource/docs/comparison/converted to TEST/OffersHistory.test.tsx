// ----------------------------------------------------------------------
// File: OffersHistory.test.tsx
// Path: frontend/src/features/offers/__tests__/OffersHistory.test.tsx
// Author: Mini, System Architect
// Created: August 11, 2025 at 01:40 AM PDT
// Version: 2.0.0 (Architecturally Superior Version)
// 👑 Cod1 Crown Certified
// ----------------------------------------------------------------------

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OffersHistory from '../OffersHistory';

const mockUseOffersHistory = jest.fn();
jest.mock('../OffersHistory', () => ({
  ...jest.requireActual('../OffersHistory'),
  __esModule: true,
  useOffersHistory: () => mockUseOffersHistory(),
}));

describe('OffersHistory Component', () => {
  it('should render a table of offers when data is successfully fetched', () => {
    const mockOffers = [
      { _id: 'offer1', carId: 'car-abc', buyer: 'Buyer One', amount: 25000, status: 'Accepted' },
    ];
    mockUseOffersHistory.mockReturnValue({ loading: false, error: '', offers: mockOffers });
    render(<OffersHistory />);
    expect(screen.getByText('car-abc')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toHaveClass('bg-green-100');
  });
});