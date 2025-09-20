import { useCallback, useEffect, useState } from 'react';
import type { Language } from '~/server/code-generator/types';
import ListMapper from '~/routes/dashboard/snippet/ListMapper';
import useLangNav from '~/hooks/langLink';

export default function LanguagesList() {
  const { link } = useLangNav();
  const [supported, setSupported] = useState<Language[]>([]);

  const loadLanguages = useCallback(async () => {
    try {
      const response = await fetch(link('api/code'));
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
