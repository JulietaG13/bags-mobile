interface RequestLogData {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: string;
}

interface ResponseLogData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  timestamp: string;
  duration: number;
}

const formatHeaders = (headers: Headers): Record<string, string> => {
  const formattedHeaders: Record<string, string> = {};
  headers.forEach((value, key) => {
    formattedHeaders[key] = value;
  });
  return formattedHeaders;
};

const logSeparator = () => {
  console.log('═'.repeat(60));
};

const getMethodColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET': return '🟦';
    case 'POST': return '🟩';
    case 'PUT': return '🟨';
    case 'DELETE': return '🟥';
    case 'PATCH': return '🟪';
    default: return '⚪';
  }
};

export const logApiRequest = (url: string, options: RequestInit): RequestLogData => {
  let parsedBody;
  if (options.body) {
    try {
      parsedBody = JSON.parse(options.body as string);
    } catch {
      parsedBody = options.body;
    }
  }

  const requestData: RequestLogData = {
    url,
    method: options.method || 'GET',
    headers: options.headers as Record<string, string> || {},
    body: parsedBody,
    timestamp: new Date().toISOString(),
  };

  // Pretty format the request log
  const methodEmoji = getMethodColor(requestData.method);
  
  console.log('');
  logSeparator();
  console.group(`🚀 API REQUEST ${methodEmoji} ${requestData.method}`);
  console.log('📍 URL:', requestData.url);
  console.log('📋 Headers:');
  console.table(requestData.headers);
  if (requestData.body) {
    console.log('📦 Body:', JSON.stringify(requestData.body, null, 2));
  }
  console.log('⏰ Timestamp:', new Date(requestData.timestamp).toLocaleTimeString());
  console.groupEnd();

  return requestData;
};

export const logApiResponse = async (
  response: Response, 
  requestData: RequestLogData, 
  startTime: number
): Promise<ResponseLogData> => {
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  let responseBody;
  try {
    // Clone the response to avoid consuming the body
    const responseClone = response.clone();
    const text = await responseClone.text();
    
    if (text) {
      try {
        responseBody = JSON.parse(text);
      } catch {
        responseBody = text;
      }
    }
  } catch (error) {
    console.warn('Failed to parse response body for logging:', error);
  }

  const responseData: ResponseLogData = {
    status: response.status,
    statusText: response.statusText,
    headers: formatHeaders(response.headers),
    body: responseBody,
    timestamp: new Date().toISOString(),
    duration,
  };

  const logEmoji = response.ok ? '✅' : '❌';
  const statusEmoji = response.ok ? '🟢' : '🔴';

  // Pretty format the response log
  const methodEmoji = getMethodColor(requestData.method);
  const durationEmoji = duration < 500 ? '🚀' : duration < 2000 ? '🐌' : '🔥';
  
  console.group(`${logEmoji} API RESPONSE ${methodEmoji} ${statusEmoji} ${responseData.status}`);
  console.log('📍 URL:', requestData.url);
  console.log('📊 Status:', `${responseData.status} ${responseData.statusText}`);
  console.log(`${durationEmoji} Duration:`, `${duration}ms`);
  console.log('📋 Response Headers:');
  console.table(responseData.headers);
  if (responseData.body) {
    console.log('📦 Response Body:', JSON.stringify(responseData.body, null, 2));
  }
  console.log('⏰ Completed:', new Date(responseData.timestamp).toLocaleTimeString());
  console.groupEnd();
  logSeparator();

  // Log error responses more prominently with extra visual emphasis
  if (!response.ok) {
    console.log('');
    console.log('🚨'.repeat(20));
    console.group(`🔥 API ERROR [${response.status}] 🚨`);
    console.log('📍 URL:', requestData.url);
    console.log('🔧 Method:', `${methodEmoji} ${requestData.method}`);
    console.log('💥 Error Details:', JSON.stringify(responseData.body || responseData.statusText, null, 2));
    console.log('📋 Response Headers:');
    console.table(responseData.headers);
    console.groupEnd();
    console.log('🚨'.repeat(20));
  }

  return responseData;
};

export const fetchWithLogging = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const startTime = Date.now();
  const requestData = logApiRequest(url, options);

  try {
    const response = await fetch(url, options);
    await logApiResponse(response, requestData, startTime);
    return response;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Pretty format the failure log with extra visual emphasis
    const methodEmoji = getMethodColor(requestData.method);
    
    console.log('');
    console.log('💥'.repeat(20));
    console.group('💥 API REQUEST FAILED 🚨');
    console.log('📍 URL:', requestData.url);
    console.log('🔧 Method:', `${methodEmoji} ${requestData.method}`);
    console.log('💥 Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('⚡ Duration:', `${duration}ms`);
    console.log('⏰ Failed at:', new Date().toLocaleTimeString());
    console.groupEnd();
    console.log('💥'.repeat(20));
    logSeparator();
    
    throw error;
  }
}; 