import { render, screen } from '@testing-library/react';
import { describe, expect, beforeEach, vi } from 'vitest';
import React from 'react';

type I18nMock = { language: string; changeLanguage: ReturnType<typeof vi.fn> };
const h = vi.hoisted(() => ({
  i18nMock: {
    language: 'en',
    changeLanguage: vi.fn(),
  } as I18nMock,
}));

vi.mock('~/i18n', () => ({
  default: h.i18nMock,
}));

let currentParams: Record<string, string | undefined> = { lang: 'en' };
vi.mock('react-router', async () => {
  const actual =
    await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useParams: () => currentParams,
    Outlet: () => <div data-testid="outlet" />,
  };
});

vi.mock('~/components/layout/Header', () => ({
  default: () => <div>HEADER-TEST</div>,
}));
vi.mock('~/components/layout/Footer', () => ({
  default: () => <div>FOOTER-TEST</div>,
}));
vi.mock('~/contexts/auth/authProvider', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('~/components/ui/sonner', () => ({ Toaster: () => null }));

import AppLayout from '~/routes/app-layout';

describe('AppLayout', () => {
  beforeEach(() => {
    currentParams = { lang: 'en' };
    h.i18nMock.language = 'en';
    h.i18nMock.changeLanguage.mockClear();
  });

  test('Renders Header, Footer, and Outlet', () => {
    render(<AppLayout />);
    expect(screen.getByText('HEADER-TEST')).toBeInTheDocument();
    expect(screen.getByText('FOOTER-TEST')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  test('Switch language if lang different', () => {
    currentParams = { lang: 'ru' };
    render(<AppLayout />);
    expect(h.i18nMock.changeLanguage).toHaveBeenCalledWith('ru');
  });

  test('Do not switch lang if land the same', () => {
    currentParams = { lang: 'en' };
    render(<AppLayout />);
    expect(h.i18nMock.changeLanguage).not.toHaveBeenCalled();
  });
});
