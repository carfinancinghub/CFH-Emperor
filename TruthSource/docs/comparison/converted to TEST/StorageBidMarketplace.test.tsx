// File: StorageBidMarketplace.test.tsx
// Path: frontend/src/components/marketplace/__tests__/StorageBidMarketplace.test.tsx
// Purpose: Tests the re-architected marketplace UI, including optimistic updates.

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import StorageBidMarketplace from '../StorageBidMarketplace';
import { BrowserRouter } from 'react-router-dom';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@/components/layout/Navbar', () => () => <nav>Navbar</nav>);
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);

describe('StorageBidMarketplace', () => {
  const mockJobs = [
    { 
      _id: 'job1', status: 'Bidding Open', carId: { make: 'Tesla', model: 'Model S', year: 2024 },
      bidHistory: [{ providerId: 'p1', price: 200, indoor: true, services: ['wash'] }]
    },
    { 
      _id: 'job2', status: 'Bidding Open', carId: { make: 'Rivian', model: 'R1T', year: 2023 },
      bidHistory: [{ providerId: 'p2', price: 300, indoor: false, services: ['charge'] }]
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn((key) => key === 'token' ? 'test-token' : 'user-123');
  });

  const renderComponent = () => render(<BrowserRouter><StorageBidMarketplace /></BrowserRouter>);

  test('should render loading state then display fetched jobs', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(await screen.findByText(/Tesla Model S/)).toBeInTheDocument();
    expect(screen.getByText(/Rivian R1T/)).toBeInTheDocument();
  });

  test('should optimistically remove a job on "Accept Bid" click and show success', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    mockedAxios.patch.mockResolvedValue({ data: { success: true } }); // API call will succeed
    renderComponent();

    const teslaCard = await screen.findByText(/Tesla Model S/);
    expect(teslaCard).toBeInTheDocument();

    const acceptButtons = screen.getAllByRole('button', { name: /Accept This Bid/i });
    fireEvent.click(acceptButtons[0]);

    // Check for optimistic UI update: the card should be gone IMMEDIATELY
    expect(screen.queryByText(/Tesla Model S/)).not.toBeInTheDocument();

    // Now wait for the API call to complete and the success message to appear
    expect(await screen.findByText('✅ Bid accepted successfully!')).toBeInTheDocument();
    expect(mockedAxios.patch).toHaveBeenCalledWith(
        expect.stringContaining('/api/storage/job1/accept'),
        { providerId: 'p1' },
        expect.any(Object)
    );
  });

  test('should revert the UI if accepting a bid fails', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    mockedAxios.patch.mockRejectedValue(new Error('API failed')); // API call will FAIL
    renderComponent();

    const teslaCard = await screen.findByText(/Tesla Model S/);
    expect(teslaCard).toBeInTheDocument();

    const acceptButtons = screen.getAllByRole('button', { name: /Accept This Bid/i });
    fireEvent.click(acceptButtons[0]);

    // Optimistic removal still happens
    expect(screen.queryByText(/Tesla Model S/)).not.toBeInTheDocument();

    // Now wait for the API call to fail, the error message to appear, and the UI to revert
    expect(await screen.findByText('❌ Failed to accept bid. Please refresh and try again.')).toBeInTheDocument();
    expect(screen.getByText(/Tesla Model S/)).toBeInTheDocument(); // The card has been restored!
  });
});