/*
 * File: HaulerJobDetailsPage.test.ts
 * Path: C:\CFH\frontend\src\components\hauler\__tests__\HaulerJobDetailsPage.test.ts
 * Purpose: Unit tests for HaulerJobDetailsPage component in the CFH Marketplace
 * Author: CFH Dev Team
 * Date: 2025-07-22T15:33:00.000Z
 * Batch ID: Marketplace-072225
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { HaulerJobDetailsPage } from '@/components/hauler/HaulerJobDetailsPage';
import { useTranslation } from '@/i18n';
import { analyticsApi } from '@/services/analyticsApi';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock dependencies
jest.mock('@/i18n');
jest.mock('@/services/analyticsApi');

const mockedUseTranslation = useTranslation as jest.Mock;
const mockedAnalyticsApi = analyticsApi as jest.Mocked<typeof analyticsApi>;

describe('HaulerJobDetailsPage', () => {
  const mockT = jest.fn((key: string) => key);
  const jobDetails = {
    jobId: '123',
    title: 'Vehicle Transport',
    pickupLocation: '123 Main St',
    dropoffLocation: '456 Oak Ave',
    deliveryDate: '2025-07-20',
    price: 1500,
    status: 'Completed',
    haulerName: 'Fast Haulers',
    vehicleDetails: { make: 'Toyota', model: 'Camry', year: '2020' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseTranslation.mockReturnValue({ t: mockT });
  });

  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/job/123']}>
        <Routes>
          <Route path="/job/:jobId" element={<HaulerJobDetailsPage userTier="Free" />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('renders job details for Free tier', async () => {
    mockedAnalyticsApi.getJobDetails.mockResolvedValue({ data: jobDetails });

    render(
      <MemoryRouter initialEntries={['/job/123']}>
        <Routes>
          <Route path="/job/:jobId" element={<HaulerJobDetailsPage userTier="Free" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('haulerJobDetails.title: Vehicle Transport')).toBeInTheDocument();
      expect(screen.getByText('haulerJobDetails.jobId: 123')).toBeInTheDocument();
      expect(screen.getByText('haulerJobDetails.hauler: Fast Haulers')).toBeInTheDocument();
      expect(screen.queryByText('haulerJobDetails.vehicleDetails')).not.toBeInTheDocument();
    });
  });

  it('renders vehicle details for Premium tier', async () => {
    mockedAnalyticsApi.getJobDetails.mockResolvedValue({ data: jobDetails });

    render(
      <MemoryRouter initialEntries={['/job/123']}>
        <Routes>
          <Route path="/job/:jobId" element={<HaulerJobDetailsPage userTier="Premium" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('haulerJobDetails.vehicleDetails')).toBeInTheDocument();
      expect(screen.getByText('haulerJobDetails.make: Toyota')).toBeInTheDocument();
    });
  });

  it('displays error when jobId is missing', async () => {
    render(
      <MemoryRouter initialEntries={['/job']}>
        <Routes>
          <Route path="/job" element={<HaulerJobDetailsPage userTier="Free" />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('haulerJobDetails.error.noJobId')).toBeInTheDocument();
    });
  });

  // TODO: Future Test Improvements
  // - Test export PDF button functionality for Wow++ tier.
  // - Add tests for editing job details when implemented.
  // - Test map view rendering for Standard+ tiers.
  // - Test error handling for specific API failure cases.
});