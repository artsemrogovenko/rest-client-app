import { describe, it, expect } from 'vitest';
import logToForm from '~/routes/dashboard/history/utils';
import { payloadTypes } from '~/routes/dashboard/restful-client/constants';
import type { RequestLog } from '~/routes/dashboard/history/types';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';

describe('logToForm', () => {
  const baseLog: RequestLog = {
    id: '1',
    endpoint: '/api/test',
    method: 'POST',
    requestSize: 0,
    responseSize: 0,
    duration: 10,
    statusCode: 200,
    timestamp: new Date().toISOString(),
  };

  it('returns default form structure when no body or headers', () => {
    const result: TRestfulSchema = logToForm(baseLog);

    expect(result).toEqual({
      body: undefined,
      endpoint: '/api/test',
      header: undefined,
      method: 'POST',
      type: payloadTypes[0],
    });
  });

  it('includes requestBody when provided', () => {
    const result = logToForm({
      ...baseLog,
      requestBody: '{"foo":"bar"}',
    });

    expect(result.body).toBe('{"foo":"bar"}');
  });

  it('maps headers to formData.header without Content-Type', () => {
    const result = logToForm({
      ...baseLog,
      requestHeaders: {
        Authorization: 'Bearer token',
        Accept: 'application/json',
      },
    });

    expect(result.header).toEqual([
      { name: 'Authorization', value: 'Bearer token' },
      { name: 'Accept', value: 'application/json' },
    ]);

    expect(result.type).toBe(payloadTypes[0]);
  });

  it('sets type from Content-Type header (case-insensitive)', () => {
    const result = logToForm({
      ...baseLog,
      requestHeaders: {
        'content-type': 'application/json',
        Accept: 'application/xml',
      },
    });

    expect(result.type).toBe('application/json');
    expect(result.header).toEqual([
      { name: 'content-type', value: 'application/json' },
      { name: 'Accept', value: 'application/xml' },
    ]);
  });
});
