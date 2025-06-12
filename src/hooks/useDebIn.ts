import { useState, useCallback } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { DebInRequest } from '../types';
import { requestDebIn } from '../services/walletService';

interface UseDebInResult {
  isLoading: boolean;
  error: string | null;
  submitDebIn: (data: DebInRequest) => Promise<boolean>;
}

export const useDebIn = (): UseDebInResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitDebIn = useCallback(async (data: DebInRequest): Promise<boolean> => {
    console.log('[DEBIN HOOK] Starting deb-in request', {
      externalServiceName: data.externalServiceName,
      serviceType: data.serviceType,
      externalEmail: data.externalEmail,
      amount: data.amount,
      timestamp: new Date().toISOString()
    });
    
    // Debug: Log the exact data being sent
    console.log('[DEBIN HOOK] Request payload:', JSON.stringify(data, null, 2));
    
    setIsLoading(true);
    setError(null);
    
    try {
      await requestDebIn(data);
      
      console.log('[DEBIN HOOK] Deb-in request completed successfully', {
        timestamp: new Date().toISOString()
      });
      
      // Show success toast
      const successMessage = `Deb-in request for $${data.amount.toFixed(2)} submitted successfully!`;
      
      if (Platform.OS === 'android') {
        ToastAndroid.show(successMessage, ToastAndroid.LONG);
      } else {
        Alert.alert('Success', successMessage);
      }
      
      return true;
    } catch (err: any) {
      let errorMessage = 'Failed to submit deb-in request';
      
      if (err.response && err.response.data) {
        errorMessage = err.response.data.detail ?? err.response.data;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        errorMessage = 'An unexpected error occurred.';
      }
      
      setError(errorMessage);
      
      console.error('[DEBIN HOOK] Failed to submit deb-in request', {
        error: err,
        errorMessage,
        timestamp: new Date().toISOString()
      });
      
      Alert.alert('Deb-in Request Failed', errorMessage);
      return false;
    } finally {
      setIsLoading(false);
      
      console.log('[DEBIN HOOK] Deb-in request completed', {
        timestamp: new Date().toISOString()
      });
    }
  }, []);

  return {
    isLoading,
    error,
    submitDebIn,
  };
}; 