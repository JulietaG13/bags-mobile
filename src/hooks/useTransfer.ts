import { useState, useCallback } from 'react';
import { API_CONFIG, getBaseUrl } from '../config/api';
import { TransferRequest } from '../types/wallet';
import { fetchWithLogging } from '../utils/apiLogger';

interface ApiError extends Error {
  status?: number;
}

const createTimeoutController = (timeoutMs: number) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  const cleanup = () => clearTimeout(timeoutId);
  
  return { signal: controller.signal, cleanup };
};

const handleApiError = (error: any, defaultMessage: string): string => {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return 'Request timed out. Please try again.';
    }
    return error.message || defaultMessage;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return defaultMessage;
};

interface TransferError {
  message: string;
  type: 'general' | 'not_found' | 'unauthorized';
  email?: string;
}

export const useTransfer = (token?: string, onUnauthorized?: () => void) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TransferError | null>(null);

  const getApiUrl = useCallback((endpoint: string) => {
    return `${getBaseUrl()}${endpoint}`;
  }, []);

  const getAuthHeaders = useCallback(() => ({
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  }), [token]);

  const sendTransfer = useCallback(async (transferData: TransferRequest): Promise<boolean> => {
    if (!token) {
      setError({ message: 'Authentication token required', type: 'general' });
      return false;
    }

    setLoading(true);
    setError(null);

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const response = await fetchWithLogging(getApiUrl(API_CONFIG.ENDPOINTS.WALLET.SEND_TRANSFER), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transferData),
        signal,
      });

      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401 && onUnauthorized) {
          onUnauthorized();
          return false;
        }
        
        // Handle 404 Not Found specifically
        if (response.status === 404) {
          const transferError: TransferError = {
            message: `No wallet with email ${transferData.toEmail} found`,
            type: 'not_found',
            email: transferData.toEmail
          };
          setError(transferError);
          return false;
        }
        
        const apiError: ApiError = new Error(`Transfer failed: ${response.status}`);
        apiError.status = response.status;
        throw apiError;
      }

      const result = await response.json();
      setError(null);
      return true;
    } catch (err) {
      const message = handleApiError(err, 'Failed to send transfer');
      setError({ message, type: 'general' });
      console.error('Transfer error:', message);
      return false;
    } finally {
      setLoading(false);
      cleanup();
    }
  }, [token, getApiUrl, getAuthHeaders, onUnauthorized]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendTransfer,
    loading,
    error,
    clearError,
  };
}; 