import codegen from 'postman-code-generators';
import sdk from 'postman-collection';
import type { RequestType } from '~/routes/dashboard/restful-client/types';
import { type ActionFunctionArgs } from 'react-router';
import type { TRestfulSchema } from '~/routes/dashboard/restful-client/validate';

const { Request } = sdk;

const indentType: 'Space' | 'Tab' = 'Space';

export function createSnippet(
  request: RequestType,
  language: string,
  variant: string
) {
  const options = {
    indentCount: 3,
    indentType,
    trimRequestBody: true,
    followRedirect: true,
  };
  const headers = request.headers
    ? Object.entries(request.headers).map(([key, value]) => ({
        key,
        value,
      }))
    : [];

  const req = new Request({
    url: request.params.encodedUrl,
    method: request.params.method || 'GET',
    header: headers,
    body: request.params.encodedData
      ? { mode: 'raw', raw: JSON.stringify(request.params.encodedData) }
      : undefined,
  });
  let result = '';
  codegen.convert(language, variant, req, options, (err, snippet) => {
    if (err) {
      result = err.message;
    }
    result = String(snippet);
  });
  return result;
}

export async function loader() {
  return JSON.stringify(codegen.getLanguageList());
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsed = JSON.parse(String(formData.get('data'))) as TRestfulSchema;
  const [language, variant] = parsed.language?.split('&') || ['', ''];

  const rawRequest: RequestType = {
    content_type: parsed.type as string,
    headers: undefined,
    params: {
      method: parsed.method as string,
      encodedUrl: parsed.endpoint as string,
      encodedData: parsed.body,
    },
  };
  const snippet = createSnippet(rawRequest, language, variant);
  return snippet;
}
