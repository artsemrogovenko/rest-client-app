import { describe, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import useLangNav from '~/hooks/langLink';
import i18n from '~/i18n';
import { DEFAULT_LOCALE, type Locale } from '~/i18n/config';
import { MemoryRouter, Route, Routes } from 'react-router';

vi.mock('~/i18n', () => {
  return {
    default: {
      language: 'en',
      changeLanguage: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock('~/i18n/config', async (orig) => {
  const actual: Record<string, unknown> = await orig();
  return {
    ...actual,
    DEFAULT_LOCALE: 'en',
    isLocale: (v: Locale) => v === 'en' || v === 'ru',
  };
});

vi.mock('react-router', async (orig) => {
  const actual: Record<string, unknown> = await orig();
  const navigateMock = vi.fn();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

function wrapperWithRoute(initialEntries: string[]) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/:lang/*" element={<>{children}</>} />
        <Route path="/*" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  );

  Wrapper.displayName = 'WrapperWithRoute';

  return Wrapper;
}

describe('useLangNav', () => {
  const mockedI18n = vi.mocked(i18n, true);

  beforeEach(() => {
    mockedI18n.changeLanguage.mockClear();
    mockedI18n.language = 'en';
  });

  test('Returns currentLang', () => {
    const { result: r1 } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/ru/products']),
    });
    expect(r1.current.currentLang).toBe('ru');

    const { result: r2 } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/xx/products']),
    });
    expect(r2.current.currentLang).toBe(DEFAULT_LOCALE);
  });

  test('Builds URLs with currentLang', () => {
    const { result } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/ru']),
    });
    expect(result.current.link()).toBe('/ru/');
    expect(result.current.link('products')).toBe('/ru/products');
    expect(result.current.link('/about')).toBe('/ru//about');
  });

  test('switchLang() inserts locale when missing and preserves search/hash', async () => {
    const { result } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/catalog?page=2#top']),
    });

    await result.current.switchLang('ru');

    expect(i18n.changeLanguage).toHaveBeenCalledWith('ru');

    const navigateMock = (await import('react-router')).useNavigate();
    expect(navigateMock).toHaveBeenCalledWith('/ru/catalog?page=2#top');
  });

  test('does not call changeLanguage when nextLang equals current i18n.language', async () => {
    i18n.language = 'ru';

    const { result } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/ru']),
    });

    await result.current.switchLang('ru');

    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });

  test('link() updates when currentLang changes (memoization check)', () => {
    const { result } = renderHook(() => useLangNav(), {
      wrapper: wrapperWithRoute(['/en']),
    });
    expect(result.current.link('x')).toBe('/en/x');

    const WrapperRu = wrapperWithRoute(['/ru']);
    const { result: r2 } = renderHook(() => useLangNav(), {
      wrapper: WrapperRu,
    });
    expect(r2.current.link('x')).toBe('/ru/x');
  });
});
