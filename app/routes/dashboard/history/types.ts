export type RequestLog = {
  id: string;
  endpoint: string;
  method: string;
  requestHeaders?: Record<string, string>;
  requestBody?: string;
  requestSize: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string;
  responseSize: number;
  statusCode?: number;
  duration?: number;
  timestamp: string;
  error?: string;
};
