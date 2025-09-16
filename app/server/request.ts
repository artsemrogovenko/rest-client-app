import type { ActionFunctionArgs } from 'react-router';
import type {
  RequestType,
  ReturnResponse,
} from '~/routes/dashboard/restful-client/types';
import { fromBase64 } from '~/routes/dashboard/restful-client/utils';
import { mockResponse } from '~/routes/dashboard/restful-client/constants';
import type { RequestLog } from '~/routes/dashboard/history/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';

async function fetchRequest(
  encodedUrl: string,
  options: {
    cache: RequestCache;
    headers: Headers;
    method: string;
    mode: RequestMode;
    body: null | string;
  },
  uuid: string
) {
  let logData: RequestLog = {
    id: Date.now().toString(),
    endpoint: encodedUrl,
    method: options.method,
    requestHeaders: Object.fromEntries(options.headers.entries()),
    requestBody: options.body,
    requestSize: new TextEncoder().encode(options.body || '').length,
    duration: 0,
    timestamp: '',
  };
  const startTask = Date.now();
  return await fetch(encodedUrl, options)
    .then(async (data) => {
      const copied = data.clone();
      const body = await copied.json();

      const result = {
        status: copied.status,
        statusText: copied.statusText,
        body: body,
      };

      logData = {
        ...logData,
        responseHeaders: Object.fromEntries(copied.headers.entries()),
        responseBody: body,
        responseSize: new TextEncoder().encode(body || '').length,
        statusCode: copied.status,
        duration: Date.now() - startTask,
        timestamp: new Date().toLocaleDateString(),
        error: null,
      };
      return {
        response: result,
        error: null,
      };
    })
    .catch((error) => {
      if (error instanceof Error) {
        logData = {
          ...logData,
          statusCode: 0,
          duration: Date.now() - startTask,
          timestamp: new Date().toLocaleDateString(),
          error: error.toString(),
        };
        return {
          response: {
            status: 500,
            statusText: error.message,
            body: `${error.cause} : ${encodedUrl} ${JSON.stringify(options)}`,
          },
          error: error.message,
        };
      }
      return mockResponse;
    })
    .finally(() => saveLog(logData, uuid));
}

export function makeRequest(request: RequestType) {
  const { method, encodedUrl, encodedData } = request.params;
  const headers = new Headers(request.headers);

  let options = {
    method: method,
    headers: headers,
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
    body: null,
  };

  if (encodedData) {
    options = Object.assign(options, { body: encodedData });
  }
  return { encodedUrl, options };
}

async function encodedToRequest(request: Request) {
  const formData = await request.formData();
  const parsed = JSON.parse(String(formData.get('data'))) as RequestType;
  console.log(parsed);
  const decodedRequest: RequestType = {
    params: {
      method: parsed.params.method,
      encodedUrl: fromBase64(parsed.params.encodedUrl),
      encodedData: parsed.params.encodedData
        ? fromBase64(parsed.params.encodedData)
        : undefined,
    },
    headers: parsed.headers
      ? Object.fromEntries(
          Object.entries(parsed.headers).map(([k, v]) => [
            fromBase64(k),
            fromBase64(v),
          ])
        )
      : undefined,
    uuid: parsed.uuid,
    code: parsed.code,
  };
  return decodedRequest;
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<ReturnResponse> {
  const decodedRequest = await encodedToRequest(request);
  const { encodedUrl, options } = makeRequest(decodedRequest);
  return await fetchRequest(encodedUrl, options, decodedRequest.uuid);
}

export const saveLog = async (logData: RequestLog, uuid: string) => {
  await addDoc(collection(db, 'users', uuid, 'logs'), logData);
};
