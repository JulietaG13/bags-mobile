// Network connectivity test utility
export const testNetworkConnectivity = async (baseUrl: string): Promise<void> => {
  console.log('[NETWORK TEST] Starting connectivity test...', {
    baseUrl,
    timestamp: new Date().toISOString()
  });

  try {
    // Test basic connectivity
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[NETWORK TEST] Health check response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
      timestamp: new Date().toISOString()
    });

    if (response.ok) {
      console.log('[NETWORK TEST] ✅ Server is reachable');
    } else {
      console.log('[NETWORK TEST] ⚠️ Server responded but with error status');
    }
  } catch (error) {
    console.error('[NETWORK TEST] ❌ Connection failed:', {
      error: error.message,
      baseUrl,
      timestamp: new Date().toISOString()
    });

    // Provide specific troubleshooting advice
    if (error.message.includes('Network request failed')) {
      console.log('[NETWORK TEST] 💡 Troubleshooting suggestions:');
      console.log('1. Check if your development server is running');
      console.log('2. Verify the IP address is correct');
      console.log('3. Ensure both devices are on the same network');
      console.log('4. Check if HTTP traffic is allowed (Android security)');
    }
  }
};

export const getNetworkInfo = () => {
  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8080';
  
  console.log('[NETWORK INFO] Current configuration:', {
    baseUrl,
    isLocalhost: baseUrl.includes('localhost'),
    isHTTP: baseUrl.startsWith('http://'),
    isHTTPS: baseUrl.startsWith('https://'),
    timestamp: new Date().toISOString()
  });

  return {
    baseUrl,
    isLocalhost: baseUrl.includes('localhost'),
    isHTTP: baseUrl.startsWith('http://'),
    isHTTPS: baseUrl.startsWith('https://'),
  };
}; 