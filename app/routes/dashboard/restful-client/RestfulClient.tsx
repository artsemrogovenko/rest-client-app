'use client';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/Response';
import { useEffect, useState } from 'react';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import {
  type Params,
  useNavigate,
  useFetcher,
  useParams,
  useSearchParams,
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
  const fetcher = useFetcher();

  useEffect(() => {
    if (params.method && params.encodedUrl) {
      sendRequest(params, searchParams);
    }
  }, [params.method, params.encodedUrl]);

  useEffect(() => {
    if (fetcher.state === 'loading') {
      setLoading(true);
      setError(null);
    } else if (fetcher.state === 'idle') {
      setLoading(false);

      if (fetcher.data) {
        if (fetcher.data.error) {
          setError(fetcher.data.error);
          setApiResponse({
            error: fetcher.data.error,
            response: null,
          });
        } else {
          setApiResponse(fetcher.data);
        }
      }
    }
  }, [params.method, params.encodedUrl, params.encodedData]);

  const sendRequest = async (
    params: Readonly<Params<string>>,
    searchParams: URLSearchParams
  ) => {
    setLoading(true);
    setError(null);

    try {
      await fetcher.submit(
        {
          data: JSON.stringify({
            params: params,
            headers: searchParams.entries(),
          }),
        },
        {
          method: 'post',
          action: '/api/request',
        }
      );
    } catch {
      setError('error');
    } finally {
      setLoading(false);
    }
  };
  const handleFormSubmit = (data: TRestfulSchema) => {
    const newUrl = convertRequestToUrl(data);
    navigate(newUrl, { replace: true, relative: 'route' });
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
          error={apiResponse.error}
          response={apiResponse.response}
          isLoading={loading}
        />
      </div>
    </section>
  );
}
