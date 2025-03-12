import React from 'react';
import { RegisterForm } from './RegisterForm';
import { renderWithProviders, screen, fireEvent, waitFor } from '../../test/testUtils';
import { act } from 'react-dom/test-utils';
import { toast } from 'react-hot-toast';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock react-router-dom's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('RegisterForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock fetch
    global.fetch = jest.fn();
  });

  it('renders the registration form correctly', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates all form fields', async () => {
    renderWithProviders(<RegisterForm />);

    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Age is required/i)).toBeInTheDocument();
    });
  });

  it('validates age is between 18 and 99', async () => {
    renderWithProviders(<RegisterForm />);

    // Fill in form fields with invalid age
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '17' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/You must be at least 18 years old/i)).toBeInTheDocument();
    });

    // Try with age > 99
    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '100' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/Age must not exceed 99/i)).toBeInTheDocument();
    });
  });

  it('validates passwords match', async () => {
    renderWithProviders(<RegisterForm />);

    // Fill in form fields with non-matching passwords
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password456' },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '25' },
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
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

    renderWithProviders(<RegisterForm />);

    // Fill in form fields correctly
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '25' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Verify fetch was called with correct arguments (excludes confirmPassword)
    expect(global.fetch).toHaveBeenCalledWith('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        age: 25,
      }),
    });

    // Verify toast success was called
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Registration successful!');
    });
  });

  it('handles registration failure', async () => {
    // Mock failed fetch response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: 'User with this email already exists',
      }),
    });

    renderWithProviders(<RegisterForm />);

    // Fill in form fields correctly
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '25' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Verify toast error was called with correct message
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('User with this email already exists');
    });
  });

  it('calls onSuccess callback when provided and registration is successful', async () => {
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
    renderWithProviders(<RegisterForm onSuccess={onSuccess} />);

    // Fill in form fields correctly
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '25' },
    });

    // Submit form
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Verify onSuccess callback was called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
