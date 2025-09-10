import type { Params } from 'react-router';
import type { ReturnResponse } from '~/routes/dashboard/restful-client/types';

export default async function makeRequest(
  params: Readonly<Params<string>>,
  searchParams: URLSearchParams
) {
  console.log(params, searchParams);
}
