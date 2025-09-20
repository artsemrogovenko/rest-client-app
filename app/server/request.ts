import type { ActionFunctionArgs } from 'react-router';
import type {
  RequestType,
  ReturnResponse,
} from '~/routes/dashboard/restful-client/types';
import { fromBase64 } from '~/routes/dashboard/restful-client/utils';
import {
  HEADER_BODY_TYPE,
  mockResponse,
} from '~/routes/dashboard/restful-client/constants';
import type { RequestLog } from '~/routes/dashboard/history/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '~/firebase/firebaseConfig';

async function fetchRequest(
  encodedUrl: string,
  options: {
    cache: RequestCache;
    headers?: Headers;
    method: string;
    mode: RequestMode;
    body?: string;
  },
  uuid: string
) {
  let logData: RequestLog = {
    id: Date.now().toString(),
    endpoint: encodedUrl,
    method: options.method,
    requestSize: new TextEncoder().encode(options.body || '').length,
    duration: 0,
    timestamp: new Date().toISOString(),
  };
  if (options.body) logData.requestBody = options.body;
  if (options.headers)
    logData.requestHeaders = Object.fromEntries(options.headers?.entries());
  console.log(typeof window);
  const startTask = Date.now();
  return await fetch(encodedUrl, options)
    .then(async (data) => {
      const copied = data.clone();
      const body = await ejectBody(copied);

      const result = {
        status: copied.status,
        statusText: copied.statusText,
        body: body,
      };

      logData = {
        ...logData,
        responseHeaders: Object.fromEntries(copied.headers.entries()),
        responseBody: body.toString(),
        responseSize: new TextEncoder().encode(body || '').length,
        statusCode: copied.status,
        duration: Date.now() - startTask,
      };
      return {
        response: result,
        error: null,
      };
    })
    .catch((error) => {
      console.log('line 63', error);
      logData = {
        ...logData,
        statusCode: 0,
        duration: Date.now() - startTask,
        error: error.toString(),
      };
      if (error instanceof Error || error instanceof TypeError) {
        return {
          response: {
            status: 0,
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

  let options = {
    method: method,
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
  };

  if (request.headers) {
    options = Object.assign(options, { headers: new Headers(request.headers) });
  }
  if (encodedData) {
    options = Object.assign(options, { body: encodedData });
  }
  return { encodedUrl, options };
}

async function encodedToRequest(request: Request) {
  const formData = await request.formData();
  const parsed = JSON.parse(String(formData.get('data'))) as RequestType;
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

export async function ejectBody(response: Response): Promise<string> {
  const contentType = response.headers.get(HEADER_BODY_TYPE);

  if (contentType?.includes('application/json')) {
    return await response.json();
  } else if (contentType?.includes('text/')) {
    return await response.text();
  } else {
    return String(await response.arrayBuffer());
  }
}
