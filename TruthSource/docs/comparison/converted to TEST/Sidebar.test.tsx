// File: Sidebar.test.tsx
// Path: frontend/src/components/layout/__tests__/Sidebar.test.tsx
// Purpose: Tests the role-based rendering and functionality of the Sidebar component.

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';
import Sidebar from '../Sidebar';

// --- Mocks ---
// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Import and retain default behavior
  useNavigate: () => mockNavigate, // Override useNavigate with our mock
}));

// --- Test Suite ---
describe('Sidebar Component', () => {

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    // Clear mock history before each test
    mockNavigate.mockClear();
    mockOnLogout.mockClear();
  });

  // Helper to render the component within the necessary Router context
  const renderSidebar = (props: any) => {
    return render(
      <MemoryRouter>
        <Sidebar {...props} />
      </MemoryRouter>
    );
  };

  // Test Case 1: Admin user
  it('should render all admin-specific links for an admin user', () => {
    const adminUser = { email: 'admin@rivers.com', role: 'admin' };
    renderSidebar({ user: adminUser, onLogout: mockOnLogout });

    expect(screen.getByText('Admin Home')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Disputes')).toBeInTheDocument();
    // Ensure links for other roles are not present
    expect(screen.queryByText('Hauler Jobs')).not.toBeInTheDocument();
  });

  // Test Case 2: Hauler user
  it('should render hauler-specific links for a hauler user', () => {
    const haulerUser = { email: 'hauler@rivers.com', role: 'hauler' };
    renderSidebar({ user: haulerUser, onLogout: mockOnLogout });

    expect(screen.getByText('Hauler Jobs')).toBeInTheDocument();
    // Ensure admin links are not present
    expect(screen.queryByText('Admin Home')).not.toBeInTheDocument();
  });

  // Test Case 3: Guest (null user)
  it('should only render common links when no user is provided', () => {
    renderSidebar({ user: null, onLogout: mockOnLogout });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Admin Home')).not.toBeInTheDocument();
    expect(screen.queryByText('👤')).not.toBeInTheDocument(); // User profile should not be visible
  });

  // Test Case 4: Logout functionality
  it('should call onLogout and navigate to /login when the logout button is clicked', () => {
    const adminUser = { email: 'admin@rivers.com', role: 'admin' };
    renderSidebar({ user: adminUser, onLogout: mockOnLogout });

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    // Check that our architectural pattern (props-driven logic) is working
    expect(mockOnLogout).toHaveBeenCalledTimes(1);
    // Check that the navigation side-effect occurs
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});