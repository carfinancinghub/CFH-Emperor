// Converted from Spinner.test.jsx — 2025-08-22T18:13:12.771176+00:00
// frontend/src/tests/ui/Spinner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Spinner from '@/components/ui/Spinner';

describe('Spinner Component', () => {
  test('renders spinner element', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // Assumes Spinner has role="status"
  });
});