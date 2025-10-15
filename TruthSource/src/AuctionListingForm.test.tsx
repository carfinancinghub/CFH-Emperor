/**
 * © 2025 CFH, All Rights Reserved
 * File: AuctionListingForm.test.tsx
 * Path: C:\CFH\frontend\src\components\auction\core\AuctionListingForm.test.tsx
 * Purpose: Test suite for AuctionListingForm premium features (AI, template, scheduling)
 * Author: [Your Name]
 * Date: 2025-08-09 0945
 * Version: 1.0.0
 * Version ID: e8d1a9e1-7c3b-4e6d-9c4f-1a2b3c4d5e6f
 * Crown Certified: Yes
 * Batch ID: CFH-AE-2025Q3
 * Artifact ID: 3c2d1e0f-4b5a-6c7d-8e9f-a0b1c2d3e4f5
 * Save Location: C:\CFH\frontend\src\components\auction\core\AuctionListingForm.test.tsx
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuctionListingForm, { AuctionListingFormProps } from '@/components/auction/core/AuctionListingForm';

jest.mock('@services/auction/AIBidStarter', () => ({
  suggestStartingBid: jest.fn(() => 5500),
}));

jest.mock('@services/auction/AuctionTemplateEngine', () => ({
  saveTemplate: jest.fn(() => 'template-xyz'),
  getTemplate: jest.fn(() => ({ description: 'Mock', tags: [], images: [] })),
}));

describe('AuctionListingForm - Premium Feature Tests', () => {
  const mockVehicle: AuctionListingFormProps['vehicle'] = {
    make: 'Tesla',
    model: 'Model 3',
    year: 2022,
    mileage: 10000,
  };

  it('renders AI suggestion for premium users', async () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    expect(await screen.findByDisplayValue('5500')).toBeInTheDocument();
  });

  it('shows locked message for AI suggestion for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    expect(screen.getByText(/upgrade to unlock AI suggestions/i)).toBeInTheDocument();
  });

  it('enables template save for premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={true} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).not.toBeDisabled();
  });

  it('disables template save for non-premium users', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const btn = screen.getByText('Save as Template');
    expect(btn).toBeDisabled();
  });

  it('shows scheduling field and restricts it based on isPremium', () => {
    render(<AuctionListingForm vehicle={mockVehicle} isPremium={false} />);
    const input = screen.getByLabelText(/Schedule Listing/i);
    expect(input).toBeDisabled();
    expect(screen.getByText(/upgrade to enable scheduling/i)).toBeInTheDocument();
  });
});
