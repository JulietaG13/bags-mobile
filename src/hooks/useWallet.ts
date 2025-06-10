import { useState, useEffect, useCallback, useRef } from 'react';
import { API_CONFIG, getBaseUrl } from '../config/api';
import { WalletInfo, TransferRecord, TransferHistoryPage } from '../types/wallet';
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

const handleApiError = (err: unknown, defaultMessage: string): string => {
  if (err instanceof Error) {
    if (err.name === 'AbortError') {
      return 'Request timed out';
    }
    return err.message;
  }
  return defaultMessage;
};

export const useWallet = (token?: string, onUnauthorized?: () => void) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const getApiUrl = useCallback((endpoint: string) => {
    return `${getBaseUrl()}${endpoint}`;
  }, []);

  const getAuthHeaders = useCallback(() => ({
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` }),
  }), [token]);

  const makeAuthenticatedRequest = useCallback(async <T>(
    url: string,
    errorMessage: string
  ): Promise<T | null> => {
    if (!token) {
      setError('Authentication token required');
      return null;
    }

    const { signal, cleanup } = createTimeoutController(API_CONFIG.TIMEOUT.DEFAULT);

    try {
      const response = await fetchWithLogging(url, {
        method: 'GET',
        headers: getAuthHeaders(),
        signal,
      });

      if (!response.ok) {
        // Handle 401 Unauthorized specifically
        if (response.status === 401 && onUnauthorized) {
          onUnauthorized();
          return null;
        }
        
        const apiError: ApiError = new Error(`${errorMessage}: ${response.status}`);
        apiError.status = response.status;
        throw apiError;
      }

      const data: T = await response.json();
      setError(null);
      return data;
    } catch (err) {
      const message = handleApiError(err, errorMessage);
      setError(message);
      console.error(`${errorMessage}:`, message);
      return null;
    } finally {
      cleanup();
    }
  }, [token, getAuthHeaders, onUnauthorized]);

  const fetchWalletInfo = useCallback(async (): Promise<void> => {
    const data = await makeAuthenticatedRequest<WalletInfo>(
      getApiUrl(API_CONFIG.ENDPOINTS.WALLET.INFO),
      'Failed to fetch wallet info'
    );
    
    if (data) {
      setWalletInfo(data);
    }
  }, [makeAuthenticatedRequest, getApiUrl]);

  const fetchTransferHistory = useCallback(async (page = 0, size = 5): Promise<void> => {
    const url = `${getApiUrl(API_CONFIG.ENDPOINTS.WALLET.TRANSFER)}?page=${page}&size=${size}`;
    const data = await makeAuthenticatedRequest<TransferHistoryPage>(
      url,
      'Failed to fetch transfer history'
    );
    
    if (data) {
      setTransfers(data.content);
    }
  }, [makeAuthenticatedRequest, getApiUrl]);

  const refreshData = useCallback(async (): Promise<void> => {
    if (!token) return;
    
    setRefreshing(true);
    try {
      await Promise.all([fetchWalletInfo(), fetchTransferHistory()]);
    } finally {
      setRefreshing(false);
    }
  }, [token, fetchWalletInfo, fetchTransferHistory]);

  const loadWalletData = useCallback(async (): Promise<void> => {
    if (!token) return;
    
    setLoading(true);
    try {
      await Promise.all([fetchWalletInfo(), fetchTransferHistory()]);
    } finally {
      setLoading(false);
    }
  }, [token, fetchWalletInfo, fetchTransferHistory]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (token && isMounted) {
      loadWalletData();
    }

    return () => {
      isMounted = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, loadWalletData]);

  return {
    walletInfo,
    transfers,
    loading,
    error,
    refreshing,
    fetchWalletInfo,
    fetchTransferHistory,
    refreshData,
    clearError,
  };
};

export default useWallet; 