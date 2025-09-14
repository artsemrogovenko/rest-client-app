'use client';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/Response';
import { useEffect, useState } from 'react';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import {
  type Params,
  useFetcher,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import convertFormToUrl from '~/routes/dashboard/restful-client/utils';
import type { ReturnResponse } from '~/routes/dashboard/restful-client/types';

export default function RestfulClient() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [apiResponse, setApiResponse] = useState<ReturnResponse>({
    error: null,
    response: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetcher = useFetcher();

  useEffect(() => {
    if (params.method && params.encodedUrl) {
      sendRequest(params, searchParams);
    }
  }, [params.method, params.encodedUrl, params.encodedData]);

  useEffect(() => {
    if (fetcher.state === 'loading') {
      setIsLoading(true);
      setError(null);
    } else if (fetcher.state === 'idle') {
      setIsLoading(false);

      if (fetcher.data) {
        if (fetcher.data.error) {
          setError(fetcher.data.error);
          setApiResponse({
            error: fetcher.data.error,
            response: fetcher.data || null,
          });
        } else {
          setApiResponse(fetcher.data);
        }
      }
    }
  }, [fetcher.data, fetcher.state]);

  const sendRequest = async (
    params: Readonly<Params<string>>,
    searchParams: URLSearchParams
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await fetcher.submit(
        {
          data: JSON.stringify({
            params: params,
            headers: Object.fromEntries(searchParams.entries()),
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
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (data: TRestfulSchema) => {
    const newUrl = convertFormToUrl(data);
    navigate(newUrl, { replace: true });
  };

  return (
    <section className="flex flex-col size-full overflow-y-scroll [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <h2>Restful Client</h2>
      <div className="flex align-center size-full gap-5 items-stretch content-start justify-center">
        <ClientForm
          initialData={{} as TRestfulSchema}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          error={error}
        />
        <ResponseComponent
          error={apiResponse.error}
          response={apiResponse.response}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
