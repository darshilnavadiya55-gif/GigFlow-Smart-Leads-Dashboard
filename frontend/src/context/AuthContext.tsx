import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import { AuthContextType, User, AuthResponse } from '../types/auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await api.login({ email, password });

        if (response.success && response.data) {
          const { user, token } = response.data;
          setUser(user);
          setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Login failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await api.register({
          email,
          password,
          confirmPassword: password
        });

        if (response.success && response.data) {
          const { user, token } = response.data;
          setUser(user);
          setToken(token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Registration failed';
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
