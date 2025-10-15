/*
 * File: VRInspection.test.tsx
 * Path: C:\CFH\frontend\src\tests\components\vr\VRInspection.test.tsx
 * Created: 2025-07-25 16:30 PDT
 * Author: Mini (AI Assistant)
 * Version: 1.0
 * Description: Jest tests for the VRInspection component.
 * Artifact ID: test-comp-vr-inspection
 * Version ID: test-comp-vr-inspection-v1.0.0
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VRInspection } from '@components/vr/VRInspection';

// Mock axios or fetch globally
global.fetch = jest.fn();

describe('VRInspection Component', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    localStorage.setItem('token', 'test-token');
  });

  it('should render the form correctly', () => {
    render(<VRInspection />);
    expect(screen.getByRole('heading', { name: /VR Inspection/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Vehicle ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start VR Inspection/i })).toBeInTheDocument();
  });

  it('should display a success message after a successful API call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ report: 'Systems OK' }),
    });

    render(<VRInspection />);
    fireEvent.change(screen.getByPlaceholderText('Vehicle ID'), { target: { value: 'vehicle123' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/✅ Inspection report: Systems OK/i)).toBeInTheDocument();
    });
  });

  it('should display an error message if the API call fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API is down'));

    render(<VRInspection />);
    fireEvent.change(screen.getByPlaceholderText('Vehicle ID'), { target: { value: 'vehicle123' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/❌ Inspection failed: API is down/i)).toBeInTheDocument();
    });
  });
});
