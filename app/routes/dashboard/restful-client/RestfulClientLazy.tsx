import { lazy, Suspense } from 'react';
const RestfulClient = lazy(() => import('./RestfulClient'));

export default function RestfulClientLazy() {
  return (
    <Suspense fallback={<p>Loading RestfulClient...</p>}>
      <RestfulClient />
    </Suspense>
  );
}
