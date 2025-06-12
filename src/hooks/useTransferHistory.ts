import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { TransferHistoryPage } from '../types/wallet';
import { getTransferHistory } from '../services/walletService';

// Helper function to format JSON for pretty logging
const formatJsonForLog = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return '[Unable to stringify data]';
  }
};

interface UseTransferHistoryResult {
  transferHistory: TransferHistoryPage | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export const useTransferHistory = (token?: string | null, initialSize = 5): UseTransferHistoryResult => {
  const [transferHistory, setTransferHistory] = useState<TransferHistoryPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransferHistory = useCallback(async (page = 0, size = initialSize, append = false) => {
    if (!token) {
      console.log('[TRANSFER HISTORY HOOK] No token available, skipping transfer history fetch');
      setIsLoading(false);
      return;
    }

    console.log('[TRANSFER HISTORY HOOK] Starting transfer history fetch', {
      page,
      size,
      append,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
    try {
      if (!append) {
        setIsLoading(true);
      }
      setError(null);
      
      const data = await getTransferHistory(page, size);
      
      if (append) {
        // Use functional update to avoid dependency on transferHistory
        setTransferHistory(prevHistory => {
          if (!prevHistory) return data;
          
          const updatedHistory = {
            ...data,
            content: [...prevHistory.content, ...data.content],
          };
          
          console.log('[TRANSFER HISTORY HOOK] Transfer history appended successfully', {
            page,
            size,
            existingItems: prevHistory.content.length,
            newItems: data.content.length,
            totalItems: updatedHistory.content.length,
            timestamp: new Date().toISOString()
          });
          
          // Log the new data being appended in pretty format
          console.log('[TRANSFER HISTORY HOOK] New transfers appended:');
          console.log(formatJsonForLog(data.content));
          
          return updatedHistory;
        });
      } else {
        console.log('[TRANSFER HISTORY HOOK] Transfer history loaded successfully', {
          page,
          size,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          contentLength: data.content.length,
          timestamp: new Date().toISOString()
        });
        
        // Log the complete transfer history in pretty format
        console.log('[TRANSFER HISTORY HOOK] Transfer history data loaded:');
        console.log(formatJsonForLog(data));
        
        setTransferHistory(data);
      }
      
      setHasMore(page < data.totalPages - 1);
      setCurrentPage(page);
      
      console.log('[TRANSFER HISTORY HOOK] Transfer history state updated', {
        hasMore: page < data.totalPages - 1,
        currentPage: page,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transfer history';
      
      console.error('[TRANSFER HISTORY HOOK] Failed to fetch transfer history', {
        error: errorMessage,
        page,
        size,
        append,
        hasToken: !!token,
        timestamp: new Date().toISOString()
      });
      
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
      
      console.log('[TRANSFER HISTORY HOOK] Transfer history fetch completed', {
        timestamp: new Date().toISOString()
      });
    }
  }, [token, initialSize]);

  const refetch = useCallback(async () => {
    console.log('[TRANSFER HISTORY HOOK] Manual transfer history refetch requested', {
      initialSize,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
    setCurrentPage(0);
    await fetchTransferHistory(0, initialSize, false);
  }, [fetchTransferHistory, initialSize]);

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      
      console.log('[TRANSFER HISTORY HOOK] Loading more transfer history', {
        currentPage,
        nextPage,
        hasMore,
        timestamp: new Date().toISOString()
      });
      
      await fetchTransferHistory(nextPage, initialSize, true);
    } else {
      console.log('[TRANSFER HISTORY HOOK] Load more skipped', {
        hasMore,
        isLoading,
        currentPage,
        reason: !hasMore ? 'No more data' : 'Already loading',
        timestamp: new Date().toISOString()
      });
    }
  }, [hasMore, isLoading, currentPage, fetchTransferHistory, initialSize]);

  useEffect(() => {
    console.log('[TRANSFER HISTORY HOOK] Initial transfer history fetch triggered', {
      initialSize,
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
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