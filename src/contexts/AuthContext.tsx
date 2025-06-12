import React, { createContext, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  handleUnauthorized: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onUnauthorized: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  onUnauthorized 
}) => {
  const handleUnauthorized = useCallback(async () => {
    console.log('[AUTH CONTEXT] 401 Unauthorized - clearing token and redirecting to login', {
      timestamp: new Date().toISOString()
    });
    
    try {
      // Clear the stored token
      await AsyncStorage.removeItem('token');
      console.log('[AUTH CONTEXT] Token cleared from AsyncStorage');
      
      // Redirect to login
      onUnauthorized();
      console.log('[AUTH CONTEXT] Redirected to login screen');
    } catch (error) {
      console.error('[AUTH CONTEXT] Error during unauthorized handling:', error);
      // Still try to redirect even if token clearing fails
      onUnauthorized();
    }
  }, [onUnauthorized]);

  return (
    <AuthContext.Provider value={{ handleUnauthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}; 