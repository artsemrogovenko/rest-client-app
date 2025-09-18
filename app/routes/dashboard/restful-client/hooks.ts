import { useCallback, useContext, useEffect, useState } from 'react';
import type { LocalVariables } from './types';
import { LOCAL_STORAGE_KEY, payloadTypes } from './constants';
import { isNotMissedVariables, inlineJson } from './utils';
import { type TRestfulSchema } from './validate';
import z from 'zod';
import AuthContext from '~/contexts/auth/AuthContext';

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
  const userId = useContext(AuthContext)?.user?.uid || '';

  useEffect(() => {
    const loadVariables = () => {
      try {
        const stringData = getStorageValue(LOCAL_STORAGE_KEY + userId);
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
    return '';
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
        let message = '';
        if (data.type === payloadTypes[1]) {
          try {
            const prepared = inlineJson(data.body);
            const parsed = JSON.parse(prepared);
            if (typeof parsed !== 'object') throw Error();
          } catch {
            message += 'body type is not json';
          }
        }
        if (data.type === payloadTypes[0]) {
          try {
            message += hasErrors(data.body, variables);
          } catch (error) {
            if (error instanceof z.ZodError) {
              message += ' body type is not text';
            }
          }
        }
        if (message) errors.body = message;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validateFormWithVariables, variables };
}
