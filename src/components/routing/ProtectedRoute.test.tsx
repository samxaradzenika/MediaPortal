import React from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { renderWithProviders, screen } from '../../test/testUtils';
import { Route, Routes, MemoryRouter } from 'react-router-dom';

// Mock child component for testing
const ProtectedComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    // Set up authentication state with a logged-in user
    const preloadedState = {
      auth: {
        user: { id: '1', email: 'user@example.com', name: 'Test User', avatar: '' },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    };

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { preloadedState }
    );

    // The protected content should be visible
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    // And the login page should not be rendered
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Set up authentication state with no logged-in user
    const preloadedState = {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      },
    };

    // Use a wrapper component to set the initial route
    const TestComponent = () => (
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    renderWithProviders(<TestComponent />, { preloadedState });

    // The login page should be visible
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    // And the protected content should not be rendered
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows loading state when authentication status is being checked', () => {
    // Set up authentication state with loading status
    const preloadedState = {
      auth: {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      },
    };

    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ProtectedComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { preloadedState }
    );

    // Loading indicator should be visible
    expect(screen.getByRole('status')).toBeInTheDocument();
    // Neither login nor protected content should be visible
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
