import { useCallback, useEffect, useState } from 'react';
import type { LocalVariables } from '~/restful-client/types';
import { LOCAL_STORAGE_KEY } from '~/restful-client/constants';
import {
  isNotMissedVariables,
} from '~/restful-client/utils';
import { type TRestfulSchema } from '~/restful-client/validate';

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
      const validation = isNotMissedVariables(data.endpoint, variables);
      if (!validation.isValid) {
        errors.endpoint = `Missing variables: ${validation.notFoundVars.join(', ')}`;
      }
    }

    data.header?.forEach((header, index) => {
      const validation = isNotMissedVariables(header.value, variables);
      if (!validation.isValid) {
        errors[`header.${index}.value`] =
          `Missing variables: ${validation.notFoundVars.join(', ')}`;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return { validateFormWithVariables, variables };
}
