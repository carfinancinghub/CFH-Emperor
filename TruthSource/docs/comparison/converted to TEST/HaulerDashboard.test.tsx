// File: HaulerDashboard.test.tsx
// Path: frontend/src/components/hauler/__tests__/HaulerDashboard.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import HaulerDashboard from '../HaulerDashboard';

// --- Mocks ---

// Mock axios to control API responses
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock custom hook
jest.mock('@/utils/useAuth', () => ({
  __esModule: true,
  default: () => ({ role: 'hauler' }),
}));

// Mock child components to isolate the dashboard for unit testing
jest.mock('@/components/admin/layout/AdminLayout', () => ({ children }: { children: React.ReactNode }) => <div data-testid="admin-layout">{children}</div>);
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);
jest.mock('@/components/common/ErrorBoundary', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);
jest.mock('@/components/hauler/HaulerReputationTracker', () => () => <div>Hauler Reputation Tracker</div>);
jest.mock('@/components/hauler/HaulerKPIStats', () => () => <div>Hauler KPI Stats</div>);
jest.mock('@/components/hauler/GeoStatusPanel', () => () => <div>Geo Status Panel</div>);

// Mock the theme object
jest.mock('@/styles/theme', () => ({
  theme: { errorText: 'text-red-500' },
}));


// --- Test Suite ---

describe('HaulerDashboard', () => {
  const mockRequests = [
    { _id: 'req1', destination: 'Los Angeles, CA', vehicle: 'Toyota Camry' },
    { _id: 'req2', destination: 'New York, NY', vehicle: 'Ford F-150' },
  ];

  beforeEach(() => {
    // Clear all mocks and reset localStorage before each test
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(key => (key === 'token' ? 'test-token' : 'hauler-123'));
    
    // Mock the file download logic
    window.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');
    window.URL.revokeObjectURL = jest.fn();
  });

  // Helper function to render the component within a router context
  const renderComponent = () => render(<BrowserRouter><HaulerDashboard /></BrowserRouter>);

  test('should render loading spinner initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Unresolved promise
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should display an error message if fetching requests fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Down'));
    renderComponent();
    expect(await screen.findByText('❌ Failed to load transportation requests')).toBeInTheDocument();
  });

  test('should display "no requests" message when API returns an empty array', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderComponent();
    expect(await screen.findByText('No new transportation requests available.')).toBeInTheDocument();
  });

  test('should render transportation requests successfully', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRequests });
    renderComponent();

    // Wait for the UI to update and check for request data
    expect(await screen.findByText('Los Angeles, CA')).toBeInTheDocument();
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('Ford F-150')).toBeInTheDocument();
  });

  test('should call accept job API and remove the request from the list on success', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRequests });
    mockedAxios.post.mockResolvedValue({ data: { success: true } }); // Mock the POST for accepting
    renderComponent();

    // Wait for the initial jobs to be visible
    const firstRequestDestination = await screen.findByText('Los Angeles, CA');
    expect(firstRequestDestination).toBeInTheDocument();

    // Find the "Accept Job" button associated with the first request and click it
    const acceptButtons = screen.getAllByRole('button', { name: /Accept Job/i });
    fireEvent.click(acceptButtons[0]);

    // Check if the POST request was made correctly
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/transportation/req1/accept`,
        {},
        { headers: { Authorization: 'Bearer test-token' } }
      );
    });

    // The card for the accepted job should be removed from the UI
    await waitFor(() => {
      expect(screen.queryByText('Los Angeles, CA')).not.toBeInTheDocument();
    });
  });

  test('should trigger a PDF download when the PDF button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockRequests });
    
    // Mock the specific GET request for the PDF blob
    const mockPdfBlob = new Blob(['pdf content'], { type: 'application/pdf' });
    mockedAxios.get.mockResolvedValueOnce({ data: mockRequests }).mockResolvedValueOnce({ data: mockPdfBlob });

    renderComponent();
    
    // Wait for jobs to render
    await screen.findByText('Los Angeles, CA');

    // Find and click the PDF button for the first job
    const pdfButtons = screen.getAllByRole('button', { name: /PDF/i });
    fireEvent.click(pdfButtons[0]);

    // Check if the PDF download API was called correctly
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/hauler/jobs/req1/export-pdf`,
        {
          responseType: 'blob',
          headers: { Authorization: 'Bearer test-token' },
        }
      );
    });

    // Check if the download link was created
    expect(window.URL.createObjectURL).toHaveBeenCalledWith(mockPdfBlob);
  });
});