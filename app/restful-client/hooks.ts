import { useCallback } from 'react';

export function useLocalStorage() {
  const getStorageValue = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) ?? '';
    }
    return '';
  }, []);

  const setStorageValue = useCallback((key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  }, []);

  const clearStorageValues = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }, []);

  const deleteStorageValue = useCallback((key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }, []);
  return {
    getStorageValue,
    setStorageValue,
    clearStorageValues,
    deleteStorageValue,
  };
}
