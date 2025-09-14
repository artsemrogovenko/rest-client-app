import { useCallback, useEffect, useState } from 'react';
import type { LocalVariables } from './types';
import { LOCAL_STORAGE_KEY } from './constants';
import { isNotMissedVariables } from './utils';
import { type TRestfulSchema } from './validate';
import z from 'zod';

export function useLocalStorage() {
  const getStorageValue = useCallback((key: string) => {
    return localStorage.getItem(key) ?? '';
  }, []);

  const setStorageValue = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);

  const clearStorageValues = useCallback(() => {
    localStorage.clear();
  }, []);

  const deleteStorageValue = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);
  return {
    getStorageValue,
    setStorageValue,
    clearStorageValues,
    deleteStorageValue,
  };
}

export function useGetVariables(): LocalVariables | null {
  const { getStorageValue } = useLocalStorage();
  const [variables, setVariables] = useState<LocalVariables | null>(null);

  useEffect(() => {
    const loadVariables = () => {
      try {
        const stringData = getStorageValue(LOCAL_STORAGE_KEY);
        if (stringData) {
          setVariables(JSON.parse(stringData));
        } else {
          setVariables(null);
        }
      } catch {
        setVariables(null);
      }
    };

    loadVariables();
  }, [getStorageValue]);

  return variables;
}

export function useVariablesValidator() {
  const variables = useGetVariables();

  function hasErrors(input: string, variables: LocalVariables) {
    const validation = isNotMissedVariables(input, variables);
    if (validation.isInvalidSyntax) {
      return 'Use syntax with two brackets example {{user}}';
    } else if (!validation.isValid && validation.notFoundVars.length > 0) {
      return `Missing variables: ${validation.notFoundVars.join(', ')}`;
    }
  }

  const validateFormWithVariables = (
    data: TRestfulSchema
  ): {
    isValid: boolean;
    errors: Record<string, string>;
  } => {
    const errors: Record<string, string> = {};

    if (!variables) {
      return {
        isValid: false,
        errors: { root: 'No saved variables' },
      };
    }

    if (data.endpoint) {
      const message = hasErrors(data.endpoint, variables);
      if (message) errors.endpoint = message;
    }

    data.header?.forEach((header, index, array) => {
      const message = hasErrors(header.value, variables);
      if (message) errors[`header.${index}.value`] = message;

      if (
        array
          .filter((object) => object !== header)
          .some((object) => object.name === header.name)
      ) {
        errors[`header.${index}.name`] = 'Header duplicate';
      }
    });

    if (data.body) {
      if (data.method === 'GET' || data.method === 'HEAD') {
        errors.body = 'GET or HEAD request cannot have a body';
      } else {
        const message = hasErrors(data.body, variables);
        if (message) errors.body = message;
      }

      if (data.type === 'application/json') {
        try {
          z.json().parse(data.body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.body += 'body type is not json';
          }
        }
      }
      if (data.type === 'text/plain; charset=utf-8') {
        try {
          z.string().parse(data.body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors.body += 'body type is not text';
          }
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validateFormWithVariables, variables };
}
