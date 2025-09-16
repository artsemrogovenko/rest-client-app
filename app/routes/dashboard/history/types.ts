export type RequestLog = {
  id: string;
  endpoint: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody?: string | null;
  requestSize: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string | null;
  responseSize?: number;
  statusCode?: number;
  duration: number;
  timestamp: string;
  error?: string | null;
};
