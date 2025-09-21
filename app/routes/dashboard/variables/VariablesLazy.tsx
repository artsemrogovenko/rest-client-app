import { lazy, Suspense } from 'react';

const Variables = lazy(() => import('./Variables'));

export default function variablesLazy() {
  return (
    <Suspense fallback={<p>Loading variables...</p>}>
      <Variables />
    </Suspense>
  );
}
