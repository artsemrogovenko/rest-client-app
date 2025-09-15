import { useCallback, useEffect, useState } from 'react';
import type { Language } from '~/server/code-generator/types';
import ListMapper from './ListMapper';

export default function LanguagesList() {
  const [supported, setSupported] = useState<Language[]>([]);

  const loadLanguages = useCallback(async () => {
    try {
      const response = await fetch('/api/code');
      const data = await response.json();
      setSupported(data);
    } catch {
      setSupported([]);
    }
  }, []);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  return ListMapper(supported);
}
