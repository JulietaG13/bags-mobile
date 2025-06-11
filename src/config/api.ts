import AsyncStorage from '@react-native-async-storage/async-storage';

// Get base URL from environment variables
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8080';

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Helper function to get auth headers
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await AsyncStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to build URL with query params
const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
  }
  return url.toString();
};

// Generic GET request
export const get = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const authHeaders = await getAuthHeaders();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const url = buildUrl(endpoint, options.params);

  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

// Generic POST request
export const post = async <T>(
  endpoint: string,
  body: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const authHeaders = await getAuthHeaders();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const url = buildUrl(endpoint, options.params);

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

// Generic PUT request
export const put = async <T>(
  endpoint: string,
  body: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const authHeaders = await getAuthHeaders();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const url = buildUrl(endpoint, options.params);

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

// Generic DELETE request
export const del = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const authHeaders = await getAuthHeaders();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const url = buildUrl(endpoint, options.params);

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

export const API_CONFIG = {
  BASE_URL: BASE_URL,

  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
    },
    WALLET: {
      BALANCE: '/wallet',
      TRANSACTIONS: '/transfer',
      SEND_MONEY: '/transfer',
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
  console.log('Using BASE_URL:', BASE_URL);
  return BASE_URL;
};

export default API_CONFIG; 