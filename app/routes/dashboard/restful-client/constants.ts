export const payloadTypes = ['text/plain; charset=utf-8', 'application/json'];
export const queryMethods = [
  'GET',
  'POST',
  'DELETE',
  'PUT',
  'PATCH',
  'OPTIONS',
  'HEAD',
];
export const languageCode = ['cURL', 'Python', 'Java', 'Go'];
export const LOCAL_STORAGE_KEY = 'variables';

export const mockResponse = new Response('Hello World!', {
  status: 200,
  statusText: 'OK',
  headers: {
    'Content-Type': 'text/plain',
    'X-Custom-Header': 'value',
  },
});
