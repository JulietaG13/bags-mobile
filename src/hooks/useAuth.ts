import { useState, useEffect } from 'react';
import { API_CONFIG, getBaseUrl } from '../config/api';
import { 
  CreateWalletRequest, 
  AuthRequest, 
  AuthResponse,
  prepareCreateWalletRequest 
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const createTimeoutController = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const originalSignal = controller.signal;
  const cleanup = () => clearTimeout(timeoutId);
  
  return { signal: originalSignal, cleanup };
};

interface UseAuthResult {
  userEmail: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: CreateWalletRequest) => Promise<AuthResponse>;
  login: (data: AuthRequest) => Promise<AuthResponse>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  getCurrentBaseUrl: () => string;
}

export const useAuth = (): UseAuthResult => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const email = await AsyncStorage.getItem('userEmail');
        
        setIsAuthenticated(!!token);
        setUserEmail(email);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUserEmail(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

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

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const requestData = prepareCreateWalletRequest(data);
      
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER);
      console.log('Registering user with BASE_URL:', getBaseUrl());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestData),
        signal,
      });

      cleanup(); // Clean up timeout since request completed

      if (!response.ok) {
        let errorMessage = `Registration failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignore JSON parsing errors for error responses
        }
        throw new Error(errorMessage);
      }

      const authResponse: AuthResponse = {
        success: true,
        token: '', // No token in register response
        message: 'Registration successful'
      };

      setLoading(false);
      return authResponse;
    } catch (err) {
      cleanup(); // Clean up timeout on error
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

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
      console.log('Logging in user with BASE_URL:', getBaseUrl());
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal,
      });

      cleanup(); // Clean up timeout since request completed

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Ensure success property is set based on response status
      const authResponse: AuthResponse = {
        success: true,
        token: result.token || '',
        message: result.message
      };

      setLoading(false);
      return authResponse;
    } catch (err) {
      cleanup(); // Clean up timeout on error
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
    userEmail,
    isAuthenticated,
    isLoading,
    register,
    login,
    loading,
    error,
    clearError,
    getCurrentBaseUrl,
  };
};

export default useAuth; 