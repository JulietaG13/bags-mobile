import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { WalletInfo } from '../types/wallet';
import { getWalletInfo } from '../services/walletService';

interface UseWalletResult {
  walletInfo: WalletInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWallet = (): UseWalletResult => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getWalletInfo();
      setWalletInfo(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallet info';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchWalletInfo();
  }, [fetchWalletInfo]);

  useEffect(() => {
    fetchWalletInfo();
  }, [fetchWalletInfo]);

  return {
    walletInfo,
    isLoading,
    error,
    refetch,
  };
}; 