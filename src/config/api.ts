// API Configuration for Bags Mobile App

export const API_CONFIG = {
  // Base URL for localhost development
  BASE_URL: 'http://localhost:3000/api',
  
  // Alternative localhost URLs for different platforms
  LOCALHOST_URLS: {
    // For iOS Simulator
    ios: 'http://localhost:3000/api',
    // For Android Emulator  
    android: 'http://10.0.2.2:3000/api',
    // For physical device (replace with your computer's IP)
    device: 'http://192.168.1.100:3000/api',
  },

  // API Endpoints
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
    },
    WALLET: {
      BALANCE: '/wallet/balance',
      TRANSACTIONS: '/wallet/transactions',
      SEND_MONEY: '/wallet/send',
      DEBIN: '/wallet/debin',
    },
  },

  // Request timeouts
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds
  },

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

// Helper function to get the correct base URL based on platform
export const getBaseUrl = () => {
  // For development, you can switch between these based on your setup
  return API_CONFIG.BASE_URL;
};

export default API_CONFIG; 