import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';
import type { RequestLog } from '~/routes/dashboard/history/types';
import {
  HEADER_BODY_TYPE,
  payloadTypes,
} from '~/routes/dashboard/restful-client/constants';

export default function logToForm(requestLog: RequestLog): TRestfulSchema {
  const formData: TRestfulSchema = {
    body: undefined,
    endpoint: requestLog.endpoint,
    header: undefined,
    method: requestLog.method,
    type: payloadTypes[0],
  };
  if (requestLog.requestBody) formData.body = requestLog.requestBody;
  if (requestLog.requestHeaders) {
    const entries = Object.entries(requestLog.requestHeaders);
    formData.header = entries.map(([key, value]) => {
      return {
        name: key,
        value: value,
      };
    });
    const foundedType = entries.filter(([key]) => key === HEADER_BODY_TYPE);
    if (foundedType) formData.type = String(foundedType[1]);
  }
  return formData;
}
