// File: TransporterLiveTracking.test.tsx
// Path: frontend/src/components/hauler/__tests__/TransporterLiveTracking.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TransporterLiveTracking from '../TransporterLiveTracking';

// Mock axios to control API responses in tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock child components to isolate the component under test
jest.mock('@/components/admin/layout/AdminLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);

describe('TransporterLiveTracking', () => {
  const mockJobs = [
    {
      _id: 'job1',
      car: { make: 'Toyota', model: 'Camry', year: 2022 },
      pickupLocation: 'New York, NY',
      deliveryLocation: 'Los Angeles, CA',
      status: 'In Transit',
    },
    {
      _id: 'job2',
      car: { make: 'Honda', model: 'Accord', year: 2023 },
      pickupLocation: 'Chicago, IL',
      deliveryLocation: 'Houston, TX',
      status: 'Pending',
    },
  ];

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'test-token');
  });

  test('should render loading spinner initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Pending promise
    render(<TransporterLiveTracking />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should render error message on API failure', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));
    render(<TransporterLiveTracking />);
    expect(await screen.findByText('❌ Failed to load transport jobs')).toBeInTheDocument();
  });

  test('should render "no active assignments" message when no jobs are returned', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    render(<TransporterLiveTracking />);
    expect(await screen.findByText('No active transport assignments.')).toBeInTheDocument();
  });

  test('should render the list of jobs on successful API call', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    render(<TransporterLiveTracking />);
    
    // Check if the first job is rendered
    expect(await screen.findByText('Toyota Camry (2022)')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();

    // Check if the second job is rendered
    expect(screen.getByText('Honda Accord (2023)')).toBeInTheDocument();
    expect(screen.getByText('Chicago, IL')).toBeInTheDocument();
  });

  test('should call location ping API when button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockJobs });
    mockedAxios.post.mockResolvedValue({ data: {} });
    window.alert = jest.fn(); // Mock window.alert

    render(<TransporterLiveTracking />);
    
    // Find the button for the first job and click it
    const pingButtons = await screen.findAllByText('Send Location Ping');
    fireEvent.click(pingButtons[0]);

    // Wait for the post request to be called
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/hauler/jobs/job1/location`,
        {},
        { headers: { Authorization: 'Bearer test-token' } }
      );
    });

    // Check if the success alert was shown
    expect(window.alert).toHaveBeenCalledWith('📍 Location ping sent successfully!');
  });
});