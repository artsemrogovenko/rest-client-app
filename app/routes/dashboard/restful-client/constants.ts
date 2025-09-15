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
export const LOCAL_STORAGE_KEY = 'variables';
export const RESTFUL_CLIENT_PATH = '/client/';

export const mockResponse = {
  response: {
    status: 0,
    statusText: 'Oops',
    body: 'something went wrong, please try again',
  },
  error: 'error',
};
