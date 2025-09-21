import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, vi } from 'vitest';
import NotFound from '~/routes/not-found';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('~/hooks/langLink', () => ({
  default: () => ({ link: (p: string) => `/en/${p}` }),
}));

describe('NotFound', () => {
  test('Renders the notFound text', () => {
    render(
      <MemoryRouter initialEntries={['/en/whatever']}>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('notFound')).toBeInTheDocument();
  });

  test('Contain a link to main-page', () => {
    render(
      <MemoryRouter initialEntries={['/en/whatever']}>
        <NotFound />
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: 'goHome' });
    expect(link).toHaveAttribute('href', '/en/');
  });
});
