import type { ActionFunctionArgs } from 'react-router';
import type {
  RequestType,
  ReturnResponse,
} from '~/routes/dashboard/restful-client/types';
import { fromBase64 } from '~/routes/dashboard/restful-client/utils';

async function makeRequest(request: RequestType) {
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

  return await fetch(encodedUrl, options).then(async (data) => {
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
  });
}

/*
export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const method = url.searchParams.get('method') || '';
  const encodedUrl = url.searchParams.get('encodedUrl') || '';
  return await makeRequest({ method, encodedUrl }, params);
}
*/

export async function action({
  request,
}: ActionFunctionArgs): Promise<ReturnResponse> {
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
  return await makeRequest(decodedRequest);
}
