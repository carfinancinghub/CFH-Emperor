// File: TitleTransferQueue.test.tsx
// Path: frontend/src/components/title/__tests__/TitleTransferQueue.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TitleTransferQueue from '../TitleTransferQueue';
import { BrowserRouter } from 'react-router-dom';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);
jest.mock('@/styles/theme', () => ({
  theme: { errorText: 'text-red-500' },
}));


describe('TitleTransferQueue', () => {
  const mockQueue = [
    { _id: 't1', vin: 'VIN123', buyer: { email: 'buyer1@test.com' }, escrowId: 'ESCROW1' },
    { _id: 't2', vin: 'VIN456', buyer: { email: 'buyer2@test.com' }, escrowId: 'ESCROW2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'test-token');
    window.alert = jest.fn(); // Mock alert
  });

  const renderComponent = () => render(<BrowserRouter><TitleTransferQueue /></BrowserRouter>);

  test('should show loading spinner initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should show an error message if fetching fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    renderComponent();
    expect(await screen.findByText('❌ Failed to load title transfer queue')).toBeInTheDocument();
  });

  test('should show "no pending transfers" message for an empty queue', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderComponent();
    expect(await screen.findByText('No pending transfers found.')).toBeInTheDocument();
  });

  test('should render the list of transfers', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockQueue });
    renderComponent();
    expect(await screen.findByText('VIN123')).toBeInTheDocument();
    expect(screen.getByText('buyer2@test.com')).toBeInTheDocument();
  });

  test('should remove item from the list when "Mark Complete" is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockQueue });
    mockedAxios.post.mockResolvedValue({ data: { success: true } });
    renderComponent();

    // Find the item to be removed
    const item1 = await screen.findByText('VIN123');
    expect(item1).toBeInTheDocument();

    // Find the button associated with the first item and click it
    const completeButtons = screen.getAllByRole('button', { name: /Mark Complete/i });
    fireEvent.click(completeButtons[0]);

    // Verify the API was called correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/title/transfers/t1/complete'),
        {},
        expect.any(Object)
      );
    });

    // Verify the item is removed from the DOM
    expect(screen.queryByText('VIN123')).not.toBeInTheDocument();
    // Verify the other item remains
    expect(screen.getByText('VIN456')).toBeInTheDocument();
  });

  test('should show an alert if marking complete fails', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockQueue });
    mockedAxios.post.mockRejectedValue(new Error('Update Failed'));
    renderComponent();

    const completeButtons = await screen.findAllByRole('button', { name: /Mark Complete/i });
    fireEvent.click(completeButtons[0]);

    await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('Error updating status. Please try again.');
    });
    // The item should NOT be removed from the list
    expect(screen.getByText('VIN123')).toBeInTheDocument();
  });
});