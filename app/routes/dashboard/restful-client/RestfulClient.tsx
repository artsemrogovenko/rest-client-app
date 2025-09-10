'use client';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/Response';
import makeRequest from '~/.server/request';
import { useEffect, useState } from 'react';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import {
  useNavigate,
  useSearchParams,
  useParams,
  type Params,
} from 'react-router';
import convertRequestToUrl from '~/routes/dashboard/restful-client/utils';
import type { ReturnResponse } from '~/routes/dashboard/restful-client/types';

export default function RestfulClient() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState<ReturnResponse>({
    error: null,
    response: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.method && params.data) {
      executeRequest(params, searchParams);
    }
  }, [params.method, params.data]);

  const executeRequest = async (
    params: Readonly<Params<string>>,
    searchParams: URLSearchParams
  ) => {
    setLoading(true);
    setError(null);

    try {
      const result = await makeRequest(params, searchParams);
      // setApiResponse(result);
    } catch {
      setError('error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data: TRestfulSchema) => {
    const newUrl = convertRequestToUrl(data);
    navigate(newUrl, { replace: true });
  };

  return (
    <section className="flex flex-col size-full overflow-y-scroll">
      <h2>Restful Client</h2>
      <div className="flex align-center size-full gap-2 items-stretch content-start justify-center p-10 ">
        <ClientForm
          initialData={{} as TRestfulSchema}
          onSubmit={handleFormSubmit}
          isLoading={loading}
          error={error}
        />
        <ResponseComponent
          error={error}
          response={apiResponse.response}
          isLoading={loading}
        />
      </div>
    </section>
  );
}
