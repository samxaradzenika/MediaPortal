import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

// Registration schema with age validation
const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(50, 'Password must not exceed 50 characters'),
    confirmPassword: z.string(),
    age: z
      .number({
        required_error: 'Age is required',
        invalid_type_error: 'Age must be a number',
      })
      .int('Age must be a whole number')
      .min(18, 'You must be at least 18 years old')
      .max(99, 'Age must not exceed 99'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      age: undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Remove confirmPassword before sending to API
      const { ...registerData } = data;

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const userData = await response.json();

      // Store auth data
      dispatch(setUser(userData.user));
      localStorage.setItem('token', userData.token);

      // Show success message
      toast.success('Registration successful!');

      // Navigate to home or call success callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          placeholder="Email"
          disabled={isLoading}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          id="password"
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          placeholder="Password"
          disabled={isLoading}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-1">
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          {...register('confirmPassword')}
          type="password"
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          placeholder="Confirm Password"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Age (18-99)
        </label>
        <input
          id="age"
          {...register('age', { valueAsNumber: true })}
          type="number"
          min={18}
          max={99}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          placeholder="Enter your age"
          disabled={isLoading}
        />
        {errors.age && <p className="text-sm text-red-500">{errors.age.message}</p>}
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Creating account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};
