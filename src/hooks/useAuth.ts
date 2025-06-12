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

// Helper function to format JSON for pretty logging
const formatJsonForLog = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return '[Unable to stringify data]';
  }
};

// Helper function to safely log request data (excluding sensitive info)
const getSafeRequestData = (data: any): object => {
  if (!data) return {};
  
  const safeData = { ...data };
  if (safeData.password) {
    safeData.password = '[HIDDEN]';
  }
  return safeData;
};

interface UseAuthResult {
  userEmail: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (data: CreateWalletRequest) => Promise<AuthResponse>;
  login: (data: AuthRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  getCurrentBaseUrl: () => string;
}

export const useAuth = (): UseAuthResult => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const email = await AsyncStorage.getItem('userEmail');
        
        console.log('[AUTH HOOK] Checking stored auth', {
          hasToken: !!storedToken,
          hasEmail: !!email,
          timestamp: new Date().toISOString()
        });
        
        setToken(storedToken);
        setIsAuthenticated(!!storedToken);
        setUserEmail(email);
      } catch (error) {
        console.error('[AUTH HOOK] Error checking auth:', error);
        setIsAuthenticated(false);
        setUserEmail(null);
        setToken(null);
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
    console.log(`[AUTH HOOK] Building API URL: ${fullUrl}`, {
      endpoint,
      baseUrl,
      timestamp: new Date().toISOString()
    });
    return fullUrl;
  };

  const register = async (data: CreateWalletRequest): Promise<AuthResponse> => {
    console.log('[AUTH HOOK] Starting user registration', {
      email: data.email,
      hasPassword: !!data.password,
      timestamp: new Date().toISOString()
    });
    
    setLoading(true);
    setError(null);

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const requestData = prepareCreateWalletRequest(data);
      
      // Log request data safely (without password)
      console.log('[AUTH HOOK] Registration request data:');
      console.log(formatJsonForLog(getSafeRequestData(requestData)));
      
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER);
      console.log('[AUTH HOOK] Sending registration request', {
        url: apiUrl,
        baseUrl: getBaseUrl(),
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(requestData),
        signal,
      });

      cleanup(); // Clean up timeout since request completed

      console.log('[AUTH HOOK] Registration response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });

      if (!response.ok) {
        let errorMessage = `Registration failed with status ${response.status}`;
        let errorData: any = {};
        
        try {
          errorData = await response.json();
          console.log('[AUTH HOOK] Registration error response:');
          console.log(formatJsonForLog(errorData));
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
            if (errorData.code) {
              errorMessage += ` (${errorData.code})`;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
            if (errorData.code) {
              errorMessage += ` (${errorData.code})`;
            }
          }
        } catch {
          console.log('[AUTH HOOK] Could not parse error response as JSON');
        }
        
        console.error('[AUTH HOOK] Registration failed', {
          status: response.status,
          error: errorMessage,
          errorData,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorMessage);
      }

      const authResponse: AuthResponse = {
        success: true,
        token: '', // No token in register response
        message: 'Registration successful'
      };

      console.log('[AUTH HOOK] Registration completed successfully');
      console.log('[AUTH HOOK] Registration response:');
      console.log(formatJsonForLog(authResponse));

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
      
      console.error('[AUTH HOOK] Registration error occurred', {
        error: errorMessage,
        baseUrl: getBaseUrl(),
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const login = async (data: AuthRequest): Promise<AuthResponse> => {
    console.log('[AUTH HOOK] Starting user login', {
      email: data.email,
      hasPassword: !!data.password,
      timestamp: new Date().toISOString()
    });
    
    // Log request data safely (without password)
    console.log('[AUTH HOOK] Login request data:');
    console.log(formatJsonForLog(getSafeRequestData(data)));
    
    setLoading(true);
    setError(null);

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const apiUrl = getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN);
      console.log('[AUTH HOOK] Sending login request', {
        url: apiUrl,
        baseUrl: getBaseUrl(),
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(data),
        signal,
      });

      cleanup(); // Clean up timeout since request completed

      console.log('[AUTH HOOK] Login response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        timestamp: new Date().toISOString()
      });

      if (!response.ok) {
        let errorData: any = {};
        let errorMessage = `Login failed with status ${response.status}`;
        
        try {
          errorData = await response.json();
          console.log('[AUTH HOOK] Login error response:');
          console.log(formatJsonForLog(errorData));
          
          if (errorData.detail) {
            errorMessage = errorData.detail;
            if (errorData.code) {
              errorMessage += ` (${errorData.code})`;
            }
          } else if (errorData.message) {
            errorMessage = errorData.message;
            if (errorData.code) {
              errorMessage += ` (${errorData.code})`;
            }
          }
        } catch {
          console.log('[AUTH HOOK] Could not parse error response as JSON');
        }
        
        console.error('[AUTH HOOK] Login failed', {
          status: response.status,
          error: errorMessage,
          errorData,
          timestamp: new Date().toISOString()
        });
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      console.log('[AUTH HOOK] Login raw response:');
      console.log(formatJsonForLog(result));
      
      // Ensure success property is set based on response status
      const authResponse: AuthResponse = {
        success: true,
        token: result.token || '',
        message: result.message
      };

      console.log('[AUTH HOOK] Login completed successfully');
      console.log('[AUTH HOOK] Processed login response:');
      console.log(formatJsonForLog({
        success: authResponse.success,
        hasToken: !!authResponse.token,
        tokenLength: authResponse.token?.length || 0,
        message: authResponse.message
      }));

      // Store token and email in AsyncStorage
      if (authResponse.token) {
        await AsyncStorage.setItem('token', authResponse.token);
        await AsyncStorage.setItem('userEmail', data.email);
        
        // Update state
        setToken(authResponse.token);
        setUserEmail(data.email);
        setIsAuthenticated(true);
        
        console.log('[AUTH HOOK] Token and email stored successfully', {
          hasToken: !!authResponse.token,
          email: data.email,
          timestamp: new Date().toISOString()
        });
      }

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
      
      console.error('[AUTH HOOK] Login error occurred', {
        error: errorMessage,
        baseUrl: getBaseUrl(),
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    console.log('[AUTH HOOK] Logging out user', {
      timestamp: new Date().toISOString()
    });
    
    try {
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(['token', 'userEmail']);
      
      // Clear state
      setToken(null);
      setUserEmail(null);
      setIsAuthenticated(false);
      
      console.log('[AUTH HOOK] Logout completed successfully');
    } catch (error) {
      console.error('[AUTH HOOK] Error during logout:', error);
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
    token,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    loading,
    error,
    clearError,
    getCurrentBaseUrl,
  };
};

export default useAuth; 