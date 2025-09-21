import { describe, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import LanguagesList from '~/routes/dashboard/snippet/LanguagesList';
import type { Language } from '~/server/code-generator/types';

vi.mock('~/hooks/langLink', () => ({
  default: () => ({ link: (p: string) => `/en/${p}` }),
}));

vi.mock('~/routes/dashboard/snippet/ListMapper', () => ({
  default: (langs: Language[]) => (
    <>
      {langs.map((l) => (
        <div key={l.key} data-testid="lang-item">
          {l.label}
        </div>
      ))}
    </>
  ),
}));

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock;
});

describe('LanguagesList', () => {
  test('Loads and displays languages', async () => {
    const mockLangs: Language[] = [
      { key: 'js', label: 'JavaScript', syntax_mode: 'js', variants: [] },
      { key: 'py', label: 'Python', syntax_mode: 'py', variants: [] },
    ];

    fetchMock.mockResolvedValueOnce({
      json: async () => mockLangs,
    });

    render(<LanguagesList />);

    await waitFor(() => {
      const items = screen.getAllByTestId('lang-item');
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveTextContent('JavaScript');
      expect(items[1]).toHaveTextContent('Python');
    });
  });

  test('There is nothing if there is a error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('fail'));

    render(<LanguagesList />);

    await waitFor(() => {
      expect(screen.queryAllByTestId('lang-item')).toHaveLength(0);
    });
  });
});
