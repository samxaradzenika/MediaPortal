import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { act } from 'react';
import Navbar from './Navbar';
import { renderWithProviders } from '../../test/testUtils';
import { setUser, logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders app title and theme toggle button', () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText('MediaPortal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('renders user info and logout button when user is authenticated', () => {
    const { store } = renderWithProviders(<Navbar />);

    // Use act to wrap the Redux state update
    act(() => {
      store.dispatch(
        setUser({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        })
      );
    });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', () => {
    const { store } = renderWithProviders(<Navbar />);

    // Use act to wrap the Redux state update
    act(() => {
      store.dispatch(
        setUser({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        })
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // Verify toast success was called
    expect(toast.success).toHaveBeenCalledWith('You have been logged out');

    // Verify user state was cleared
    expect(store.getState().auth.user).toBeNull();
  });
});
