import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { TransferHistoryPage } from '../types/wallet';
import { getTransferHistory } from '../services/walletService';

interface UseTransferHistoryResult {
  transferHistory: TransferHistoryPage | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const useTransferHistory = (initialSize = 5): UseTransferHistoryResult => {
  const [transferHistory, setTransferHistory] = useState<TransferHistoryPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransferHistory = useCallback(async (page = 0, size = initialSize, append = false) => {
    try {
      if (!append) {
        setIsLoading(true);
      }
      setError(null);
      
      const data = await getTransferHistory(page, size);
      
      if (append && transferHistory) {
        // Append new data to existing data
        setTransferHistory({
          ...data,
          content: [...transferHistory.content, ...data.content],
        });
      } else {
        setTransferHistory(data);
      }
      
      setHasMore(page < data.totalPages - 1);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transfer history';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [initialSize, transferHistory]);

  const refetch = useCallback(async () => {
    setCurrentPage(0);
    await fetchTransferHistory(0, initialSize, false);
  }, [fetchTransferHistory, initialSize]);

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      await fetchTransferHistory(nextPage, initialSize, true);
    }
  }, [hasMore, isLoading, currentPage, fetchTransferHistory, initialSize]);

  useEffect(() => {
    fetchTransferHistory();
  }, [fetchTransferHistory]);

  return {
    transferHistory,
    isLoading,
    error,
    refetch,
    loadMore,
    hasMore,
  };
}; 