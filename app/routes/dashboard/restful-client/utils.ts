import { type TRestfulSchema } from './validate';
import type { LocalVariables } from './types';
import {
  payloadTypes,
  RESTFUL_CLIENT_PATH,
} from '~/routes/dashboard/restful-client/constants';

export function deleteBrackets(value: string) {
  return value.replace(/\{\{|}}/g, '');
}

export function findValue(variableName: string, object: LocalVariables) {
  return Object.entries(object).find(([k]) => {
    return deleteBrackets(k) === variableName;
  })?.[0];
}

export function collectVariables(input: string): string[] {
  if (!isValidBrackets(input)) {
    return [];
  }
  const regex = /\{\{([^}]+)}}/g;
  const matches = input.match(regex);
  if (!matches) return [];
  return matches;
}

export function collectVariablesNames(input: string): string[] {
  return collectVariables(input)
    .map((match) => deleteBrackets(match).trim())
    .filter((name) => name.length > 0);
}

export function isNotMissedVariables(
  input: string,
  variables: LocalVariables
): { isValid: boolean; notFoundVars: string[]; isInvalidSyntax: boolean } {
  const extractedVars = collectVariablesNames(input);
  const missed: string[] = [];

  extractedVars.forEach((variable) => {
    if (variable && !findValue(variable, variables)) {
      missed.push(variable);
    }
  });

  if (!isValidBrackets(input)) {
    return {
      isValid: false,
      notFoundVars: missed,
      isInvalidSyntax: true,
    };
  }

  return {
    isValid: missed.length === 0,
    notFoundVars: missed,
    isInvalidSyntax: false,
  };
}

export function isValidBrackets(input: string) {
  const stack: string[] = [];
  const exampleName = 'sample';
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '{' && input[i + 1] === '{') {
      stack.push(exampleName);
      i++;
      continue;
    }

    if (input[i] === '}' && input[i + 1] === '}') {
      if (stack.length === 0 || stack[stack.length - 1] !== exampleName) {
        return false;
      }
      stack.pop();
      i++;
      continue;
    }

    if (input[i] === '{' || input[i] === '}') {
      return false;
    }
  }

  return stack.length === 0;
}

export function ejectVariables(
  input: string,
  variables: LocalVariables
): string {
  let result = input;
  const collection = collectVariables(input);
  collection.forEach((name) => {
    result = result.replaceAll(name, variables[name]);
  });
  return result;
}

export function convertValues(data: TRestfulSchema, variables: LocalVariables) {
  const cloned = JSON.parse(JSON.stringify(data)) as TRestfulSchema;
  cloned.endpoint = ejectVariables(String(cloned.endpoint), variables);
  if (cloned.body) cloned.body = ejectVariables(cloned.body, variables);
  if (cloned.header) {
    cloned.header = cloned.header.map((line) => {
      return { name: line.name, value: ejectVariables(line.value, variables) };
    });
  }
  return cloned;
}

export default function convertFormToUrl(data: TRestfulSchema): string {
  const method = RESTFUL_CLIENT_PATH + data.method;
  const endpoint = toBase64(String(data.endpoint));
  const body = data.body ? `/${toBase64(data.body)}` : '';
  let headers = '';
  if (data.header?.length) {
    headers = data.header?.reduce((acc, value, index, array) => {
      acc += `${toBase64(value.name)}=${toBase64(value.value)}`;
      if (index !== array.length - 1) acc += '&';
      return acc;
    }, '=?');
  }
  if (data.body) {
    headers += !data.header?.length ? '=?' : '&';
    headers += `${toBase64('Content-Type')}=${toBase64(String(data.type))}`;
  }
  return `${method}/${endpoint}${body}${headers}`;
}

export function toBase64(str: string) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function fromBase64(str: string) {
  try {
    return atob(str.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, ''));
  } catch {
    return '';
  }
}

export function convertUrlToForm(
  method: string | undefined,
  encodedUrl: string | undefined,
  encodedData: string | undefined,
  searchParams: URLSearchParams
): TRestfulSchema {
  const formData: TRestfulSchema = {
    body: undefined,
    endpoint: undefined,
    header: undefined,
    method: method,
    type: payloadTypes[0],
  };
  if (encodedUrl) formData.endpoint = fromBase64(encodedUrl);
  if (encodedData) formData.body = fromBase64(encodedData);
  if (searchParams) {
    let typeIndex: number | null = null;
    let headers = Array.from(searchParams.entries()).map((header, index) => {
      const key = fromBase64(header[0]);
      const value = fromBase64(header[1]);
      if (key.toLowerCase() === 'content-type') {
        formData.type = value;
        typeIndex = index;
      }
      return { name: key, value: value };
    });
    if (typeIndex) {
      headers = headers.filter((_, index) => index !== typeIndex);
    }
    formData.header = headers;
  }
  return formData;
}

export function prepareJson(input: string) {
  if (!input || typeof input !== 'string') {
    throw new Error('String is empty');
  }
  let result = input;
  try {
    return JSON.parse(result);
  } catch {
    result = result
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  return result;
}
