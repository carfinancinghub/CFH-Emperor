// Converted from VINDecoder.test.jsx — 2025-08-22T18:13:14.169365+00:00
// File: VINDecoder.test.jsx
// Path: frontend/src/tests/VINDecoder.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VINDecoder from '@components/mechanic/VINDecoder';

test('renders VIN input and displays mock vehicle data', async () => {
  render(<VINDecoder />);
  fireEvent.change(screen.getByPlaceholderText(/Enter VIN/i), { target: { value: '1HGCM82633A123456' }});
  fireEvent.click(screen.getByText(/Decode VIN/i));
  expect(await screen.findByText(/Honda/)).toBeInTheDocument();
});
