import React, { Suspense, lazy } from 'react';
import { useLoaderData } from 'react-router';
import type { RequestLog } from '~/routes/dashboard/history/types';
import { historyLoader } from './historyLoader.server';

export { historyLoader as loader };

const HistoryTable = lazy(
  () => import('~/routes/dashboard/history/HistoryTable.client')
);

interface LoaderData {
  logs: RequestLog[];
}

export default function HistoryPage() {
  const { logs } = useLoaderData<LoaderData>();

  return (
    <Suspense fallback={<p>Loading history...</p>}>
      <HistoryTable logs={logs} />
    </Suspense>
  );
}
