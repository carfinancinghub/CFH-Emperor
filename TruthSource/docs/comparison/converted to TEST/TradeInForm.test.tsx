// File: TradeInForm.test.tsx
// Path: frontend/src/components/trade-in/__tests__/TradeInForm.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TradeInForm from '../TradeInForm';
import { BrowserRouter } from 'react-router-dom';

// --- Mocks ---
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('@/components/layout/Navbar', () => () => <nav>Navbar</nav>);
// We can use a simple mock for our custom input and button to focus on form logic
jest.mock('@/components/common/Input', () => (props: any) => <input data-testid="input" {...props} />);
jest.mock('@/components/common/Button', () => (props: any) => <button data-testid="button" {...props} />);

describe('TradeInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'test-token');
  });

  const renderComponent = () => render(<BrowserRouter><TradeInForm /></BrowserRouter>);

  test('should render the form with all fields', () => {
    renderComponent();
    expect(screen.getByText('Trade-In Evaluation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Make (e.g., Toyota)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Model (e.g., Camry)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Year (e.g., 2022)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Condition (e.g., Good)')).toBeInTheDocument();
  });

  test('should update form data on user input', () => {
    renderComponent();
    const makeInput = screen.getByPlaceholderText('Make (e.g., Toyota)');
    fireEvent.change(makeInput, { target: { value: 'Honda' } });
    expect(makeInput).toHaveValue('Honda');
  });

  test('should show a success message with the value on successful submission', async () => {
    mockedAxios.post.mockResolvedValue({ data: { value: 22500 } });
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Make (e.g., Toyota)'), { target: { name: 'make', value: 'Honda' } });
    fireEvent.change(screen.getByPlaceholderText('Model (e.g., Camry)'), { target: { name: 'model', value: 'Civic' } });
    fireEvent.change(screen.getByPlaceholderText('Year (e.g., 2022)'), { target: { name: 'year', value: '2023' } });
    fireEvent.change(screen.getByPlaceholderText('Condition (e.g., Good)'), { target: { name: 'condition', value: 'Excellent' } });
    
    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    // Check loading state
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Evaluating...');

    // Wait for and check the success message
    const successMessage = await screen.findByText('✅ Trade-in value: $22,500');
    expect(successMessage).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('should show an error message on failed submission', async () => {
    mockedAxios.post.mockRejectedValue(new Error('API Error'));
    renderComponent();

    const submitButton = screen.getByTestId('button');
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText('❌ Evaluation failed. Please check the details and try again.');
    expect(errorMessage).toBeInTheDocument();
  });
});