import type { ResponseComponentProps } from '~/routes/dashboard/restful-client/types';

export default function ResponseComponent({
  isLoading,
  response,
}: ResponseComponentProps) {
  const resultBody = (): string => {
    if (!response) return '';
    const body = response.body;
    if (typeof body === 'object') {
      return JSON.stringify(body);
    }
    return response.statusText;
    console.log(response, isLoading);
  };

  return (
    <aside className="flex flex-col gap-2 rounded-lg border min-w-[450px] w-1/2 flex-1 p-5 ">
      <h3>Response</h3>
      <div className="flex flex-col gap-2 rounded-lg border p-2 h-full">
        <span className="rounded-lg border p-2">
          Status: {response?.status}
        </span>
        <h4>Body</h4>
        <p className="break-all">{resultBody()}</p>
      </div>
    </aside>
  );
}
