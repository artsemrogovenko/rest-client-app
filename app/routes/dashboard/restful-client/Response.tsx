import type { ResponseComponentProps } from '~/routes/dashboard/restful-client/types';
import { StatusIndicator } from '~/routes/dashboard/restful-client/ResponseIndicator';
import ResponseSkeleton from '~/routes/dashboard/restful-client/ResponseSkeleton';

export default function ResponseComponent({
  isLoading,
  response,
}: ResponseComponentProps) {
  const resultBody = (): string => {
    if (!response) return '';
    const body = response.body;
    if (typeof body === 'object') {
      return JSON.stringify(body, null, 2);
    }
    return response.statusText;
  };

  return (
    <aside className="flex flex-col gap-2 rounded-lg border min-w-[450px] w-1/2 flex-1 p-5">
      <h3>Response</h3>
      <div className="flex flex-col gap-2 rounded-lg border p-2">
        <StatusIndicator response={response} error={null} />
        {isLoading ? (
          <ResponseSkeleton />
        ) : (
          <pre className="text-sm font-mono overflow-y-scroll h-full">
            <code style={{ whiteSpace: 'pre-wrap' }}>{resultBody()}</code>
          </pre>
        )}
      </div>
    </aside>
  );
}
