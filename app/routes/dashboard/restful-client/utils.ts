import { storageVariablesSchema, type TRestfulSchema } from './validate';
import type { LocalVariables } from './types';

export function deleteBrackets(value: string) {
  return value.replace(/\{\{|}}/g, '');
}

export function isContainValues(value: object): value is LocalVariables {
  const result = storageVariablesSchema.safeParse(value);
  return result.success;
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
