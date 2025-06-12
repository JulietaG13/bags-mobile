import AsyncStorage from '@react-native-async-storage/async-storage';

// Get base URL from environment variables
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8080';

// Log the base URL being used
console.log('[API CONFIG] Base URL configured:', {
  baseUrl: BASE_URL,
  source: process.env.EXPO_PUBLIC_BASE_URL ? 'environment' : 'default',
  timestamp: new Date().toISOString()
});

// Global 401 handler - set by the AuthProvider
let globalUnauthorizedHandler: (() => Promise<void>) | null = null;

export const setGlobalUnauthorizedHandler = (handler: (() => Promise<void>) | null) => {
  globalUnauthorizedHandler = handler;
  console.log('[API CONFIG] Global unauthorized handler set', { 
    hasHandler: !!handler,
    timestamp: new Date().toISOString()
  });
};

const handle401 = async (url: string, status: number) => {
  if (status === 401 && globalUnauthorizedHandler) {
    console.log('[API CONFIG] 401 detected, calling global unauthorized handler', {
      url,
      timestamp: new Date().toISOString()
    });
    await globalUnauthorizedHandler();
  }
};

interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

// Helper function to format JSON for pretty logging
const formatJsonForLog = (data: any, maxDepth = 3): string => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    return '[Unable to stringify data]';
  }
};

// Enhanced error handling for network issues
const handleNetworkError = (error: any, url: string): Error => {
  console.error('[API ERROR] Network error details:', {
    error: error.message,
    baseUrl: BASE_URL,
    fullUrl: url,
    timestamp: new Date().toISOString()
  });

  if (error.message.includes('Network request failed') || 
      error.message.includes('fetch') ||
      error.message.includes('TypeError')) {
    return new Error('Unable to connect to server. Please check your internet connection.');
  }
  
  return error;
};

// Helper function to parse error responses and extract detail and code
const parseErrorResponse = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    if (errorData.detail) {
      errorMessage = errorData.detail;
      if (errorData.code) {
        errorMessage += ` (${errorData.code})`;
      }
    } else if (errorData.message) {
      errorMessage = errorData.message;
      if (errorData.code) {
        errorMessage += ` (${errorData.code})`;
      }
    }
    
    return errorMessage;
  } catch (parseError) {
    // If we can't parse the error response, return a generic message
    return `HTTP error! status: ${response.status}`;
  }
};

// Helper function to get a summary of response data
const getDataSummary = (data: any): object => {
  if (!data) return { isEmpty: true };
  
  if (Array.isArray(data)) {
    return {
      type: 'array',
      length: data.length,
      firstItem: data.length > 0 ? Object.keys(data[0] || {}) : []
    };
  }
  
  if (typeof data === 'object') {
    return {
      type: 'object',
      keys: Object.keys(data),
      keyCount: Object.keys(data).length
    };
  }
  
  return {
    type: typeof data,
    value: data
  };
};

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
  
  // Log request start
  console.log(`[API REQUEST] GET ${url}`, {
    endpoint,
    params: options.params,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    // Log response status
    console.log(`[API RESPONSE] GET ${url} - Status: ${response.status}`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    // Handle 401 before checking response.ok
    await handle401(url, response.status);

    if (!response.ok) {
      console.error(`[API ERROR] GET ${url} - HTTP Error: ${response.status}`);
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log successful response with pretty JSON
    console.log(`[API SUCCESS] GET ${url} - Response Data:`, {
      summary: getDataSummary(data),
      timestamp: new Date().toISOString()
    });
    
    // Log the actual JSON data in a pretty format
    console.log(`[API DATA] GET ${url} - JSON Response:\n${formatJsonForLog(data)}`);

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    const networkError = handleNetworkError(error, url);
    console.error(`[API ERROR] GET ${url} - Request failed:`, networkError);
    throw networkError;
  }
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
  
  // Log request start with pretty request body
  console.log(`[API REQUEST] POST ${url}`, {
    endpoint,
    hasBody: !!body,
    bodyType: typeof body,
    params: options.params,
    timestamp: new Date().toISOString()
  });
  
  // Log the request body in pretty format
  if (body) {
    console.log(`[API REQUEST BODY] POST ${url}:\n${formatJsonForLog(body)}`);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // Log response status
    console.log(`[API RESPONSE] POST ${url} - Status: ${response.status}`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    // Handle 401 before checking response.ok
    await handle401(url, response.status);

    if (!response.ok) {
      console.error(`[API ERROR] POST ${url} - HTTP Error: ${response.status}`);
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log successful response with pretty JSON
    console.log(`[API SUCCESS] POST ${url} - Response Data:`, {
      summary: getDataSummary(data),
      timestamp: new Date().toISOString()
    });
    
    // Log the actual JSON data in a pretty format
    console.log(`[API DATA] POST ${url} - JSON Response:\n${formatJsonForLog(data)}`);

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    const networkError = handleNetworkError(error, url);
    console.error(`[API ERROR] POST ${url} - Request failed:`, networkError);
    throw networkError;
  }
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
  
  // Log request start with pretty request body
  console.log(`[API REQUEST] PUT ${url}`, {
    endpoint,
    hasBody: !!body,
    bodyType: typeof body,
    params: options.params,
    timestamp: new Date().toISOString()
  });
  
  // Log the request body in pretty format
  if (body) {
    console.log(`[API REQUEST BODY] PUT ${url}:\n${formatJsonForLog(body)}`);
  }

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    // Log response status
    console.log(`[API RESPONSE] PUT ${url} - Status: ${response.status}`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    // Handle 401 before checking response.ok
    await handle401(url, response.status);

    if (!response.ok) {
      console.error(`[API ERROR] PUT ${url} - HTTP Error: ${response.status}`);
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log successful response with pretty JSON
    console.log(`[API SUCCESS] PUT ${url} - Response Data:`, {
      summary: getDataSummary(data),
      timestamp: new Date().toISOString()
    });
    
    // Log the actual JSON data in a pretty format
    console.log(`[API DATA] PUT ${url} - JSON Response:\n${formatJsonForLog(data)}`);

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    const networkError = handleNetworkError(error, url);
    console.error(`[API ERROR] PUT ${url} - Request failed:`, networkError);
    throw networkError;
  }
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
  
  // Log request start
  console.log(`[API REQUEST] DELETE ${url}`, {
    endpoint,
    params: options.params,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    // Log response status
    console.log(`[API RESPONSE] DELETE ${url} - Status: ${response.status}`, {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    // Handle 401 before checking response.ok
    await handle401(url, response.status);

    if (!response.ok) {
      console.error(`[API ERROR] DELETE ${url} - HTTP Error: ${response.status}`);
      const errorMessage = await parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Log successful response with pretty JSON
    console.log(`[API SUCCESS] DELETE ${url} - Response Data:`, {
      summary: getDataSummary(data),
      timestamp: new Date().toISOString()
    });
    
    // Log the actual JSON data in a pretty format
    console.log(`[API DATA] DELETE ${url} - JSON Response:\n${formatJsonForLog(data)}`);

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    const networkError = handleNetworkError(error, url);
    console.error(`[API ERROR] DELETE ${url} - Request failed:`, networkError);
    throw networkError;
  }
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