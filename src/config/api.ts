export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000/api',

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

  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000,  // 30 seconds
  },

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

export const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_BASE_URL) {
    console.log('Using BASE_URL from environment:', process.env.EXPO_PUBLIC_BASE_URL);
    return process.env.EXPO_PUBLIC_BASE_URL;
  }

  console.log('Using default BASE_URL:', API_CONFIG.BASE_URL);
  return API_CONFIG.BASE_URL;
};

export default API_CONFIG; 