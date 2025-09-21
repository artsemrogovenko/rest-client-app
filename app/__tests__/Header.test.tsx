import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '~/components/layout/Header';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router';

vi.mock('~/contexts/auth/useAuth', () => ({
  default: () => ({ user: null }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('~/hooks/langLink', () => ({
  default: () => ({
    link: (path: string) => `/en/${path}`,
  }),
}));

describe('Header', () => {
  test('Logo is present', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('H&H')).toBeInTheDocument();
    expect(screen.getByText('H&H').closest('a')).toHaveAttribute(
      'href',
      '/en/'
    );
  });

  test('Authorization buttons are present', () => {
    render(
      <MemoryRouter initialEntries={['/en/']}>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('signUp')).toBeInTheDocument();
  });

  test('Add scroll class', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <Header />
      </MemoryRouter>
    );
    const header = screen.getByRole('banner');
    expect(header).not.toHaveClass('scrolled');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(header).toHaveClass('scrolled');
  });
});
