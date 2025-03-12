import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { act } from 'react';
import { renderWithProviders } from '../../test/testUtils';
import toast from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest.fn();
  });

  it('renders the login form correctly', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('validates email and password fields', async () => {
    renderWithProviders(<LoginForm />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'avatar-url',
        },
        token: 'mock-token',
      }),
    });

    renderWithProviders(<LoginForm />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Verify fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    // Verify toast success was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
    });
  });

  it('handles login failure', async () => {
    // Mock failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'Invalid email or password',
      }),
    });

    renderWithProviders(<LoginForm />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Verify toast error was called with correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  it('calls onSuccess callback when provided and login is successful', async () => {
    // Mock successful fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'avatar-url',
        },
        token: 'mock-token',
      }),
    });

    const onSuccess = jest.fn();
    renderWithProviders(<LoginForm onSuccess={onSuccess} />);

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    // Verify onSuccess callback was called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
