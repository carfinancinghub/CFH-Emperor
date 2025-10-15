// File: TransporterJobStatus.test.tsx
// Path: frontend/src/components/hauler/__tests__/TransporterJobStatus.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TransporterJobStatus from '../TransporterJobStatus';

// Mock axios and child components
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);

describe('TransporterJobStatus', () => {
  const mockJobs = [
    {
      _id: 'job1',
      car: { make: 'Ford', model: 'F-150', year: 2024 },
      status: 'Assigned',
      pickupLocation: 'Detroit, MI',
      dropoffLocation: 'Miami, FL',
      eta: 48,
      multiHauler: true,
    },
    {
      _id: 'job2',
      car: { make: 'Chevy', model: 'Silverado', year: 2021 },
      status: 'Delivered',
      pickupLocation: 'Austin, TX',
      dropoffLocation: 'Denver, CO',
      eta: 24,
      multiHauler: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'hauler-token');
    window.alert = jest.fn(); // Mock alert for button clicks
  });

  test('should render loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    render(<TransporterJobStatus />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render error message on API failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    render(<TransporterJobStatus />);
    expect(await screen.findByText('Failed to load job data')).toBeInTheDocument();
  });

  test('should render job details, including multi-hauler route', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    render(<TransporterJobStatus />);

    // Check for job 1 details
    expect(await screen.findByText('Ford F-150 (2024)')).toBeInTheDocument();
    expect(screen.getByText('ETA: 48 hours')).toBeInTheDocument();
    expect(screen.getByText('🛤️ Multi-Hauler Route')).toBeInTheDocument();
  });

  test('should render delivery complete message for "Delivered" status', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    render(<TransporterJobStatus />);

    // Check for job 2's conditional text
    expect(await screen.findByText('🎉 Delivery complete. Buyer feedback pending.')).toBeInTheDocument();
  });

  test('should call alert when "Start Delivery" button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    render(<TransporterJobStatus />);
    
    // Find the button within the card for the first job
    const startButton = await screen.findByText('▶️ Start Delivery');
    fireEvent.click(startButton);
    
    expect(window.alert).toHaveBeenCalledWith('Starting delivery for job job1');
  });

  test('should call alert when "Mark as Delivered" button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    render(<TransporterJobStatus />);
    
    const deliveredButton = await screen.findByText('✅ Mark as Delivered');
    fireEvent.click(deliveredButton);

    expect(window.alert).toHaveBeenCalledWith('Marking job job1 as delivered');
  });
});