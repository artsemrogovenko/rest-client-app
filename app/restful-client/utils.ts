import { storageVariablesSchema } from '~/restful-client/validate';
import type { LocalVariables } from '~/restful-client/types';

export function deleteBrackets(value: string) {
  return value.replace(/\{\{|}}/g, '');
}

export function isContainValues(value: object): value is LocalVariables {
  const result = storageVariablesSchema.safeParse(value);
  return result.success;
}

export function findValue(variableName: string, object: LocalVariables) {
  return Object.entries(object).find(([, v]) => {
    return deleteBrackets(v) === variableName;
  })?.[0];
}

export function collectVariablesNames(input: string): string[] {
  const regex = /\{\{([^}]+)}}/g;
  const matches = input.match(regex);
  if (!matches) return [];

  return matches
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
  const singleBracketRegex = /[{}]/g;
  const brackets = input.match(singleBracketRegex);

  if (!brackets) return true;

  const stack: string[] = [];
  for (const char of brackets) {
    if (char === '{') {
      stack.push(char);
    } else if (char === '}') {
      if (stack.length === 0) return false;
      stack.pop();
    }
  }

  return stack.length === 0;
}

export function isCorrectVariableSyntax(input: string) {
  const invalidPatterns = [
    /\{[^{}]+}/,
    /\{\{[^{}]+}[^}]/,
    /[^{]\{[^{}]+}}/,
    /\{\{[^{}]*\{[^{}]*}}/,
  ];

  return !invalidPatterns.some((pattern) => pattern.test(input));
}
