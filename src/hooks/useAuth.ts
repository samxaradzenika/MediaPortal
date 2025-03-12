import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout, User, setLoading, setError } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

interface AuthData {
  email: string;
  password: string;
  age?: number;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLocalLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const login = useCallback(
    async (data: AuthData) => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to login. Please try again.');
        }

        const userData = await response.json();

        dispatch(setUser(userData.user));
        localStorage.setItem('token', userData.token);

        toast.success('Login successful!');
        navigate('/');
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to login. Please try again.';
        setLocalError(errorMessage);
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
        return false;
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate]
  );

  const register = useCallback(
    async (data: AuthData) => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register. Please try again.');
        }

        const userData = await response.json();

        dispatch(setUser(userData.user));
        localStorage.setItem('token', userData.token);

        toast.success('Registration successful!');
        navigate('/');
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to register. Please try again.';
        setLocalError(errorMessage);
        dispatch(setError(errorMessage));
        toast.error(errorMessage);
        return false;
      } finally {
        setLocalLoading(false);
        dispatch(setLoading(false));
      }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      setLocalLoading(true);

      await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      localStorage.removeItem('token');
      dispatch(logout());

      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  }, [dispatch, navigate]);

  return {
    login,
    register,
    logout: handleLogout,
    loading,
    error,
  };
};
