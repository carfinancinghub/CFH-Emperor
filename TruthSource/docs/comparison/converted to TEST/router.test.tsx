// File: router.test.tsx
// Path: frontend/src/router/__tests__/router.test.tsx
// Purpose: Tests the core security logic of the application router.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

// We need to mock the useAuth hook and the ProtectedRoute component for testing
// This is a simplified version of the component from router.tsx for testing purposes.
const mockUseAuth = jest.fn();
jest.mock('@/hooks/useAuth', () => ({
    useAuth: () => mockUseAuth(),
}));
import { ProtectedRoute } from '../router'; // Assuming ProtectedRoute is exported

const ChildComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderWithRoute = (allowedRoles: string[]) => {
        return render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                        <Route path="/protected" element={<ChildComponent />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    };

    it('should redirect to login if user is not authenticated', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: false, role: null });
        renderWithRoute(['admin']);
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should show an access denied message if user role is not allowed', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, role: 'buyer' });
        renderWithRoute(['admin']);
        expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render the child component if user is authenticated and authorized', () => {
        mockUseAuth.mockReturnValue({ isAuthenticated: true, role: 'admin' });
        renderWithRoute(['admin', 'seller']);
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
});