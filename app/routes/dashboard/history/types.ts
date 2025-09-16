export type RequestLog = {
  id: string;
  url: string;
  method: string;
  requestHeaders: Record<string, string>;
  requestBody?: string | null;
  requestSize: number;
  responseHeaders?: Record<string, string>;
  responseBody?: string | null;
  responseSize: number;
  statusCode: number;
  latency: number;
  timestamp: string;
  error?: string | null;
};