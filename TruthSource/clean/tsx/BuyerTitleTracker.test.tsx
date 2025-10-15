// Converted from BuyerTitleTracker.test.jsx — 2025-08-22T18:13:11.915923+00:00
// File: BuyerTitleTracker.test.jsx
// Path: frontend/src/tests/buyer/BuyerTitleTracker.test.jsx
// Purpose: Verify title verification status and blockchain audit logic
// Author: Cod1 - Rivers Auction QA
// Date: May 14, 2025
// 👑 Cod1 Crown Certified

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import BuyerTitleTracker from '@components/buyer/BuyerTitleTracker';

jest.mock('axios');

describe('BuyerTitleTracker Component', () => {
  const mockTitle = {
    status: 'Cleared',
    verified: true,
    blockchainLog: ['block1', 'block2'],
  };

  it('shows basic title info (free user)', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTitle });
    render(<BuyerTitleTracker vin="VIN123" isPremium={false} />);
    await waitFor(() => expect(screen.getByText(/Cleared/)).toBeInTheDocument());
    expect(screen.getByText(/Blockchain audit data is available/)).toBeInTheDocument();
  });

  it('renders blockchain snapshot for premium', async () => {
    axios.get.mockResolvedValueOnce({ data: mockTitle });
    render(<BuyerTitleTracker vin="VIN123" isPremium />);
    await waitFor(() => expect(screen.getByText(/Title Tracker/)).toBeInTheDocument());
  });

  it('handles fetch error', async () => {
    axios.get.mockRejectedValueOnce(new Error('Title API error'));
    render(<BuyerTitleTracker vin="BADVIN" isPremium />);
    await waitFor(() =>
      expect(screen.getByText(/Unable to load title information/)).toBeInTheDocument()
    );
  });
});