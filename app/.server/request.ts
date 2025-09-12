import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  Params,
} from 'react-router';
import type { ReturnResponse } from '~/routes/dashboard/restful-client/types';
import { mockResponse } from '~/routes/dashboard/restful-client/constants';

export default async function makeRequest(
  params: Readonly<Params<string>>,
  searchParams: URLSearchParams
): Promise<ReturnResponse> {
  console.log(params, searchParams);
  return { error: null, response: mockResponse };
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const method = url.searchParams.get('method') || '';
  const encodedUrl = url.searchParams.get('encodedUrl') || '';
  return await makeRequest({ method, encodedUrl }, params);
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ReturnResponse> {
  console.log(request, params);
  return await fetchRickAndMortyCharacters()
    .then((data: Response) => {
      return {
        response: data.clone(),
        error: null,
      };
    })
    .catch((error) => {
      return {
        response: null,
        error: error.toString(),
      };
    });
  // try {
  //   const formData = await request.formData();
  //   const method = formData.get('method');
  //   const encodedUrl = formData.get('encodedUrl');
  //   const encodedData = formData.get('encodedData');
  //
  //   if(!method && !encodedUrl)        throw new Error();
  //   const targetUrl =fromBase64  (String(encodedUrl  ))
  //   const requestData =fromBase64(String( encodedData))
  //
  //
  //   const result = await makeRequest(
  //     {
  //       method: method ,
  //       url: targetUrl,
  //     },
  //     params
  //   );
  //
  //   return result;
  // } catch {
  //   return {
  //     response: null,
  //     error: 'Failed to make request',
  //   };
  // }
}

async function fetchRickAndMortyCharacters() {
  try {
    const response = await fetch('https://rickandmortyapi.com/api/character');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching characters:', error);
    throw error;
  }
}
