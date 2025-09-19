import type { ResponseComponentProps } from '~/routes/dashboard/restful-client/types';
import { StatusIndicator } from '~/routes/dashboard/restful-client/response/ResponseIndicator';
import ResponseSkeleton from '~/routes/dashboard/restful-client/response/ResponseSkeleton';
import { useTranslation } from 'react-i18next';

export default function ResponseComponent({
  isLoading,
  response,
  error,
}: ResponseComponentProps) {
  const { t } = useTranslation();
  const isDocument = () => {
    if (!response || !response.body) return null;

    const body = response.body;
    if (typeof body === 'string' && body.length >= 15) {
      const lowerBody = body.toLowerCase().trim();
      if (lowerBody.includes('<!doctype') || lowerBody.includes('<html')) {
        return (
          <iframe
            srcDoc={body}
            title="response document"
            className="w-full h-[70vh]"
          />
        );
      }
    }
    return null;
  };

  const isPayload = () => {
    if (!response) return '';
    const body = response.body;
    if (typeof body === 'object') {
      return JSON.stringify(body, null, 2);
    }
    if (typeof body === 'undefined') {
      return error || '';
    }
    return body || response.statusText;
  };

  const isBody = () => {
    return (
      <pre className="text-sm font-mono overflow-y-scroll">
        <code style={{ whiteSpace: 'pre-wrap' }}>{isPayload()}</code>
      </pre>
    );
  };

  const resultContainer = () => isDocument() || isBody();

  return (
    <aside className="flex flex-col gap-2 rounded-lg border min-w-[450px] w-1/2 flex-1 p-5 h-fit">
      <h3>{t('response')}</h3>
      <div className="flex flex-col gap-2 rounded-lg border p-2">
        <StatusIndicator response={response} error={error} />
        {isLoading ? <ResponseSkeleton /> : resultContainer()}
      </div>
    </aside>
  );
}
