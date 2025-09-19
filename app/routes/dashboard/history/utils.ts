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
      if (key.toLowerCase() === HEADER_BODY_TYPE.toLowerCase()) {
        formData.type = value;
      }
      return {
        name: key,
        value: value,
      };
    });
  }
  return formData;
}
