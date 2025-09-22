import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('~/routes/dashboard/restful-client/utils', () => ({
  convertFormToUrl: vi.fn(() => '/mock-url'),
  convertUrlToForm: vi.fn(() => ({ mock: true })),
}));

vi.mock('~/hooks/langLink', () => ({
  __esModule: true,
  default: () => ({ link: (p: string) => `/lang/${p}` }),
}));

const mockNavigate = vi.fn();
const mockSubmit = vi.fn();

vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useFetcher: () => ({ state: 'idle', submit: mockSubmit, data: null }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams()],
  };
});

vi.mock('~/contexts/auth/AuthContext', () => ({
  __esModule: true,
  default: React.createContext({ user: { uid: '123' } }),
}));

import RestfulClient from '~/routes/dashboard/restful-client/RestfulClient';

describe('RestfulClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders heading and children', () => {
    render(<RestfulClient />);
    expect(screen.getByText('restClient')).toBeInTheDocument();
  });
});
