import { useState } from 'react';
import { API_CONFIG, getBaseUrl } from '../config/api';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    token: string;
  };
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBaseUrl()}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.DEFAULT),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setLoading(false);
      return result;
    } catch (err) {
      let errorMessage = 'Network error occurred';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('Network request failed')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const login = async (data: LoginData): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${getBaseUrl()}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.DEFAULT),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      setLoading(false);
      return result;
    } catch (err) {
      let errorMessage = 'Network error occurred';
      
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again.';
        } else if (err.message.includes('Network request failed')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    login,
    loading,
    error,
    clearError,
  };
};

export default useAuth; 