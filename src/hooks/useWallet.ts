import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { WalletInfo } from '../types/wallet';
import { getWalletInfo } from '../services/walletService';

// Helper function to format JSON for pretty logging
const formatJsonForLog = (data: any): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return '[Unable to stringify data]';
  }
};

interface UseWalletResult {
  walletInfo: WalletInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWallet = (token?: string | null): UseWalletResult => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletInfo = useCallback(async () => {
    if (!token) {
      console.log('[WALLET HOOK] No token available, skipping wallet fetch');
      return;
    }
    
    console.log('[WALLET HOOK] Starting wallet info fetch', {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getWalletInfo();
      
      console.log('[WALLET HOOK] Wallet info loaded successfully', {
        balance: data.balance?.amount,
        currency: data.currency,
        timestamp: new Date().toISOString()
      });
      
      // Log the wallet data in pretty JSON format
      console.log('[WALLET HOOK] Wallet data received:');
      console.log(JSON.stringify(data, null, 2));
      
      setWalletInfo(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet info';
      setError(errorMessage);
      console.error('[WALLET HOOK] Failed to fetch wallet info', {
        error: err,
        errorMessage,
        hasToken: !!token,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsLoading(false);
      
      console.log('[WALLET HOOK] Wallet info fetch completed', {
        hasData: !!walletInfo,
        timestamp: new Date().toISOString()
      });
    }
  }, [token]);

  const refetch = useCallback(async () => {
    console.log('[WALLET HOOK] Manual wallet refetch requested', {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
    await fetchWalletInfo();
  }, [fetchWalletInfo]);

  useEffect(() => {
    console.log('[WALLET HOOK] Initial wallet info fetch triggered', {
      hasToken: !!token,
      timestamp: new Date().toISOString()
    });
    
    fetchWalletInfo();
  }, [fetchWalletInfo]);

  return {
    walletInfo,
    isLoading,
    error,
    refetch,
  };
}; 