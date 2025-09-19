import { useCallback, useEffect, useState } from 'react';
import type { Language } from '~/server/code-generator/types';
import ListMapper from '~/routes/dashboard/snippet/ListMapper';

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
  }, []);

  return ListMapper(supported);
}
