import { useCallback } from 'react';

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
    // if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
    // }
  }, []);
  return {
    getStorageValue,
    setStorageValue,
    clearStorageValues,
    deleteStorageValue,
  };
}
