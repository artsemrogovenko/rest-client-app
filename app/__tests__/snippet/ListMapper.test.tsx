import { describe, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ListMapper from '~/routes/dashboard/snippet/ListMapper';
import type { Language } from '~/server/code-generator/types';

vi.mock('~/components/ui/select', () => ({
  SelectItem: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="select-item" data-value={value}>
      {children}
    </div>
  ),
}));

describe('ListMapper', () => {
  test('Displays languages', () => {
    const mockLanguages: Language[] = [
      {
        key: 'js',
        label: 'JavaScript',
        syntax_mode: 'js',
        variants: [{ key: 'Fetch' }, { key: 'XHR' }],
      },
      {
        key: 'py',
        label: 'Python',
        syntax_mode: 'py',
        variants: [{ key: 'Requests' }],
      },
    ];

    render(<>{ListMapper(mockLanguages)}</>);

    const items = screen.getAllByTestId('select-item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('data-value', 'js&Fetch');
    expect(items[0]).toHaveTextContent('JavaScript Fetch');
    expect(items[1]).toHaveAttribute('data-value', 'js&XHR');
    expect(items[1]).toHaveTextContent('JavaScript XHR');
    expect(items[2]).toHaveAttribute('data-value', 'py&Requests');
    expect(items[2]).toHaveTextContent('Python Requests');
  });

  test('Displays empty', () => {
    render(<>{ListMapper([])}</>);
    expect(screen.queryAllByTestId('select-item')).toHaveLength(0);
  });
});
