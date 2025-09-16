import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import type { RequestLog } from '~/routes/dashboard/history/types';

export default function logToForm(requestLog: RequestLog): TRestfulSchema {
  const formData: TRestfulSchema = {
    body: undefined,
    endpoint: requestLog.endpoint,
    header: undefined,
    method: requestLog.method,
    type: undefined,
  };
  if (requestLog.endpoint) formData.endpoint = requestLog.endpoint;
  if (requestLog.requestHeaders) {
    const foundedType = Object.entries(requestLog.requestHeaders).filter(
      ([key]) => key.toLowerCase() === 'content-type'
    );
    if (foundedType) formData.type = String(foundedType[1]);
  }

  return formData;
}
