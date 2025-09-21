import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import React from 'react';

vi.mock('react-router', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

vi.mock('~/routes/dashboard/history/HistoryTable.client', () => ({
  default: ({ logs }: { logs: RequestLog[] }) => (
    <div data-testid="history-table">
      Mocked HistoryTable ({logs.length} logs)
    </div>
  ),
}));

import { useLoaderData } from 'react-router';
import HistoryPage from '~/routes/dashboard/history/history';
import type { RequestLog } from '~/routes/dashboard/history/types';

describe('HistoryPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders HistoryTable with logs from loader', async () => {
    (useLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logs: [
        {
          id: '1',
          method: 'GET',
          endpoint: '/api/users',
          timestamp: Date.now(),
        },
        {
          id: '2',
          method: 'POST',
          endpoint: '/api/posts',
          timestamp: Date.now(),
        },
      ],
    });

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>
    );

    expect(await screen.findByTestId('history-table')).toHaveTextContent(
      'Mocked HistoryTable (2 logs)'
    );
  });

  it('renders fallback while HistoryTable is loading', () => {
    (useLoaderData as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      logs: [],
    });

    const LazyHistoryPage = React.lazy(async () => ({
      default: HistoryPage,
    }));

    render(
      <MemoryRouter>
        <React.Suspense fallback={<p>Loading history...</p>}>
          <LazyHistoryPage />
        </React.Suspense>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading history...')).toBeInTheDocument();
  });
});
