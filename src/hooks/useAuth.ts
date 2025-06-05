import { useState } from 'react';
import { API_CONFIG, getBaseUrl } from '../config/api';
import { 
  CreateWalletRequest, 
  AuthRequest, 
  AuthResponse,
  prepareCreateWalletRequest 
} from '../types/dtos';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiUrl = (endpoint: string) => {
    const baseUrl = getBaseUrl();
    const fullUrl = `${baseUrl}${endpoint}`;
    console.log(`API Request to: ${fullUrl}`);
    return fullUrl;
  };

  const register = async (data: CreateWalletRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const requestData = prepareCreateWalletRequest(data);
      
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER);
      console.log('Registering user with BASE_URL:', getBaseUrl());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.DEFAULT),
      });

      const result: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error('Registration failed');
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
      
      console.error('Registration error:', errorMessage, 'BASE_URL:', getBaseUrl());
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const login = async (data: AuthRequest): Promise<AuthResponse> => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
      console.log('Logging in user with BASE_URL:', getBaseUrl());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT.DEFAULT),
      });

      const result: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error('Login failed');
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
      
      console.error('Login error:', errorMessage, 'BASE_URL:', getBaseUrl());
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getCurrentBaseUrl = () => {
    return getBaseUrl();
  };

  return {
    register,
    login,
    loading,
    error,
    clearError,
    getCurrentBaseUrl,
  };
};

export default useAuth; 