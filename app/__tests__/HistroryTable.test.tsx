import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import HistoryTable from '~/routes/dashboard/history/HistoryTable';
import type { RequestLog } from '~/routes/dashboard/history/types';

const mockNavigate = vi.fn();
const mockLink = (path: string) => `/lang/${path}`;
const mockLogToForm = vi.fn();
const mockConvertFormToUrl = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: { uid: 'user123' } }),
}));

const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', async () => {
  const actual =
    await vi.importActual<typeof import('firebase/firestore')>(
      'firebase/firestore'
    );
  return {
    ...actual,
    collection: vi.fn(),
    getDocs: (...args: unknown[]) => mockGetDocs(...args),
    orderBy: vi.fn(),
    query: vi.fn(),
  };
});

vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('~/hooks/langLink', () => ({
  __esModule: true,
  default: () => ({ link: mockLink }),
}));

vi.mock('~/routes/dashboard/history/utils', () => ({
  __esModule: true,
  default: (log: RequestLog) => mockLogToForm(log),
}));

vi.mock('~/routes/dashboard/restful-client/utils', () => ({
  __esModule: true,
  default: (form: unknown) => mockConvertFormToUrl(form),
}));

describe('HistoryTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders empty state when no logs', async () => {
    mockGetDocs.mockResolvedValueOnce({ docs: [] });

    render(<HistoryTable />);

    expect(await screen.findByText('no-history')).toBeInTheDocument();
    expect(screen.getByText('empty-here')).toBeInTheDocument();
    expect(screen.getByText('restClient')).toBeInTheDocument();
  });

  it('renders logs when Firestore returns data', async () => {
    const mockLog: RequestLog = {
      id: 'log1',
      timestamp: new Date().toISOString(),
      method: 'GET',
      endpoint: '/api/test',
      statusCode: 200,
      duration: 123.4,
      requestSize: 100,
      responseSize: 200,
      error: '',
    };
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: mockLog.id,
          data: () => {
            const { ...rest } = mockLog;
            return rest;
          },
        },
      ],
    });

    render(<HistoryTable />);

    expect(await screen.findByText('GET')).toBeInTheDocument();
    expect(screen.getByText('/api/test')).toBeInTheDocument();
  });

  it('navigates to client form on row click', async () => {
    const mockLog: RequestLog = {
      id: 'log1',
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint: '/api/submit',
      statusCode: 400,
      duration: 50.5,
      requestSize: 10,
      responseSize: 20,
      error: 'Bad Request',
    };

    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: mockLog.id,
          data: () => {
            const { ...rest } = mockLog;
            return rest;
          },
        },
      ],
    });

    mockLogToForm.mockReturnValue({ form: 'mockForm' });
    mockConvertFormToUrl.mockReturnValue('/mock-url');

    render(<HistoryTable />);

    const row = await screen.findByText('POST');
    fireEvent.click(row);

    expect(mockLogToForm).toHaveBeenCalledWith(mockLog);
    expect(mockConvertFormToUrl).toHaveBeenCalledWith({ form: 'mockForm' });
    expect(mockNavigate).toHaveBeenCalledWith('/lang/mock-url');
  });
});
