// File: TitleIssueZone.test.tsx
// Path: frontend/src/components/title/__tests__/TitleIssueZone.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TitleIssueZone from '../TitleIssueZone';
import { BrowserRouter } from 'react-router-dom';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@/components/layout/Navbar', () => () => <nav>Navbar</nav>);
jest.mock('@/components/common/LoadingSpinner', () => () => <div>Loading...</div>);

describe('TitleIssueZone', () => {
  const mockTitleRecords = [
    { _id: 'rec1', status: 'missing', carId: { make: 'Ford', model: 'Focus', year: 2010 } },
    { _id: 'rec2', status: 'rejected', carId: { make: 'Honda', model: 'Accord', year: 2015 } },
    { _id: 'rec3', status: 'clear', carId: { make: 'Toyota', model: 'Camry', year: 2020 } },
    { _id: 'rec4', status: 'pending', carId: { make: 'Chevy', model: 'Malibu', year: 2018 } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'test-token');
  });

  const renderComponent = () => render(<BrowserRouter><TitleIssueZone /></BrowserRouter>);

  test('should display loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('should filter and display only cars with "missing" or "rejected" titles', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockTitleRecords });
    renderComponent();

    // Wait for the component to process the data
    await waitFor(() => {
        expect(screen.getByText(/Ford Focus/)).toBeInTheDocument();
    });

    // It SHOULD display the problem cars
    expect(screen.getByText(/Ford Focus/)).toBeInTheDocument();
    expect(screen.getByText('MISSING')).toBeInTheDocument();
    expect(screen.getByText(/Honda Accord/)).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();

    // It SHOULD NOT display cars with other statuses
    expect(screen.queryByText(/Toyota Camry/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Chevy Malibu/)).not.toBeInTheDocument();
  });

  test('should display a message when no title-issue cars are found', async () => {
    const noIssueRecords = [
        { _id: 'rec3', status: 'clear', carId: { make: 'Toyota', model: 'Camry', year: 2020 } },
        { _id: 'rec4', status: 'pending', carId: { make: 'Chevy', model: 'Malibu', year: 2018 } },
    ];
    mockedAxios.get.mockResolvedValue({ data: noIssueRecords });
    renderComponent();

    expect(await screen.findByText('No title-issue vehicles at the moment.')).toBeInTheDocument();
  });

  test('should render a disabled "Bidding Restricted" button for each issue car', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockTitleRecords.slice(0, 2) }); // Only issue cars
    renderComponent();

    const buttons = await screen.findAllByRole('button', { name: /Bidding Restricted/i });
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toBeDisabled();
  });
});