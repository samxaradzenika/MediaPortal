import { render, screen, fireEvent } from '@testing-library/react';
import { AuthForm } from './AuthForm';

describe('AuthForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnChange = jest.fn();

  const defaultProps = {
    title: 'Test Form',
    buttonText: 'Submit',
    isRegister: false,
    loading: false,
    errors: {},
    values: {
      email: '',
      password: '',
    },
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<AuthForm {...defaultProps} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/age/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders register form with age field when isRegister is true', () => {
    render(<AuthForm {...defaultProps} isRegister />);

    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
  });

  it('displays error messages when provided', () => {
    const errors = {
      email: 'Invalid email',
      password: 'Password is required',
    };

    render(<AuthForm {...defaultProps} errors={errors} />);

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('calls onChange when input values change', () => {
    render(<AuthForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });

    expect(mockOnChange).toHaveBeenCalledWith('email', 'test@example.com');
  });

  it('calls onSubmit when form is submitted', () => {
    render(<AuthForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole('form'));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(<AuthForm {...defaultProps} loading />);

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });
});
