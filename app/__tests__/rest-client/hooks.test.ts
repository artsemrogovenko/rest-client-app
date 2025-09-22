import { afterAll, describe, beforeEach } from 'vitest';
import { LOCAL_STORAGE_KEY } from '~/routes/dashboard/restful-client/constants';
import { useLocalStorage } from '~/routes/dashboard/restful-client/hooks';
import { renderHook, type RenderHookResult } from '@testing-library/react';

describe('localStorage utils', () => {
  let rendered: RenderHookResult<
    {
      getStorageValue: (key: string) => string;
      setStorageValue: (key: string, value: string) => void;
      clearStorageValues: () => void;
      deleteStorageValue: (key: string) => void;
    },
    unknown
  >;
  beforeEach(() => {
    rendered = renderHook(() => useLocalStorage());
    localStorage.clear();
  });
  afterAll(() => {
    localStorage.clear();
  });

  test('Intestially, there are no value', () => {
    const { getStorageValue } = rendered.result.current;
    expect(getStorageValue(LOCAL_STORAGE_KEY)).toBe('');
    expect(localStorage.length).toBe(0);
  });

  test('Delete key in storage', () => {
    const { deleteStorageValue } = rendered.result.current;
    localStorage.setItem(LOCAL_STORAGE_KEY, '5');
    expect(localStorage.length).toBe(1);
    deleteStorageValue(LOCAL_STORAGE_KEY);
    expect(localStorage.length).toBe(0);
  });

  test('Clear localstorage', () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'test');
    const { clearStorageValues, getStorageValue } = rendered.result.current;
    clearStorageValues();
    expect(getStorageValue(LOCAL_STORAGE_KEY)).toBe('');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(null);
  });

  test('Set localstorage', () => {
    const { setStorageValue, getStorageValue } = rendered.result.current;
    setStorageValue(LOCAL_STORAGE_KEY, '123');
    expect(getStorageValue(LOCAL_STORAGE_KEY)).toBe('123');
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('123');
  });
});
