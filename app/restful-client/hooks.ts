export function useLocalStorage() {
  const getStorageValue = (key: string) => localStorage.getItem(key) ?? '';
  const setStorageValue = (key: string, value: string) =>
    localStorage.setItem(key, value);
  const clearStorageValues = () => localStorage.clear();
  const deleteStorageValue = (key: string) => localStorage.removeItem(key);

  return {
    getStorageValue,
    setStorageValue,
    clearStorageValues,
    deleteStorageValue,
  };
}
