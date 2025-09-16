'use client';
import ClientForm from '~/routes/dashboard/restful-client/ClientForm';
import ResponseComponent from '~/routes/dashboard/restful-client/response/Response';
import { useEffect, useRef, useState } from 'react';
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
import { auth } from '~/firebase/firebaseConfig';

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
  const codeVariant = useRef<string>('');
  const hasSendForm = useRef<boolean>(false);
  const newFormData = useRef<TRestfulSchema | undefined>(undefined);

  useEffect(() => {
    if (params.method && params.encodedUrl && hasSendForm.current) {
      sendRequest(params, searchParams);
    }
  }, [params.method, params.encodedUrl, params.encodedData]);

  useEffect(() => {
    if (fetcher.state === 'submitting') {
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
            uuid: auth.currentUser?.uid,
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
    hasSendForm.current = true;
    codeVariant.current = String(data.language);
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
          isSubmitting={fetcher.state === 'submitting'}
          newData={newFormData.current}
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
