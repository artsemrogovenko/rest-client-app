import type { RequestType } from '~/routes/dashboard/restful-client/types';
import { ejectBody, makeRequest } from '~/server/request';
import { testFormData } from '../setupTests';

describe('Response to string', () => {
  const testObject = { test: 'object' };

  test('json to string', async () => {
    const response = new Response(JSON.stringify(testObject), {
      status: 200,
      statusText: 'ok',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    const result = await ejectBody(response);
    expect(result).toStrictEqual({
      test: 'object',
    });
  });

  test('text to string', async () => {
    const response = new Response(testObject.test, {
      status: 200,
      statusText: 'ok',
      headers: new Headers({ 'Content-Type': 'text/' }),
    });
    const result = await ejectBody(response);
    expect(result).toBe(testObject.test);
  });

  test('blob to string', async () => {
    const response = new Response(new Blob(), {
      status: 200,
      statusText: 'ok',
      headers: new Headers({ 'Content-Type': 'image/jpeg' }),
    });
    const result = await ejectBody(response);
    expect(result).toBe('[object ArrayBuffer]');
  });
});

describe('makeRequest', () => {
  it('create request options without headers/body', () => {
    const request: RequestType = {
      params: {
        method: testFormData.method,
        encodedUrl: testFormData.endpoint,
        encodedData: undefined,
      },
      headers: undefined,
      uuid: '123',
    };

    const { encodedUrl, options } = makeRequest(request);
    expect(encodedUrl).toBe('https://memi.klev.club/uploads/');
    expect(options.method).toBe('POST');
    expect(options.mode).toBe('cors');
    expect(options.cache).toBe('default');
    expect(options).not.toHaveProperty('headers');
    expect(options).not.toHaveProperty('body');
  });

  it('should add headers and body if provided', () => {
    const request: RequestType = {
      params: {
        method: testFormData.method,
        encodedUrl: testFormData.endpoint,
        encodedData: testFormData.body,
      },
      headers: Object.fromEntries(Object.values(testFormData.header.entries())),
      uuid: '123',
    };

    const { options } = makeRequest(request);
    expect(options.method).toBe('POST');
    expect(options.mode).toBe('cors');
    expect(options.cache).toBe('default');
    expect(options).toHaveProperty('headers');
    expect(options).toHaveProperty('body');
  });
});
