import type { ActionFunctionArgs } from 'react-router';
import type {
  RequestType,
  ReturnResponse,
} from '~/routes/dashboard/restful-client/types';
import { fromBase64 } from '~/routes/dashboard/restful-client/utils';
import { mockResponse } from '~/routes/dashboard/restful-client/constants';

async function fetchRequest(
  encodedUrl: string,
  options: {
    cache: RequestCache;
    headers: Headers;
    method: string;
    mode: RequestMode;
  }
) {
  return await fetch(encodedUrl, options)
    .then(async (data) => {
      const copied = data.clone();
      const body = await copied.json();

      const result = {
        status: copied.status,
        statusText: copied.statusText,
        body: body,
      };
      return {
        response: result,
        error: null,
      };
    })
    .catch((error) => {
      if (error instanceof Error) {
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
    });
}

export function makeRequest(request: RequestType) {
  const { method, encodedUrl, encodedData } = request.params;
  const headers = new Headers(request.headers);
  headers.append('Content-Type', request.content_type);

  let options = {
    method: method,
    headers: headers,
    mode: 'cors' as RequestMode,
    cache: 'default' as RequestCache,
  };

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
    content_type: parsed.content_type,
  };
  return decodedRequest;
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<ReturnResponse> {
  const decodedRequest = await encodedToRequest(request);
  const { encodedUrl, options } = makeRequest(decodedRequest);
  return await fetchRequest(encodedUrl, options);
}

/*
funtion logger(data: Response){
    const saveData ={}as  RequestLog ;
    await addDoc(collection(db, "logs"), saveData);
}*/
