import '@testing-library/jest-dom';
import { describe, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MainPage from '~/routes/main-page';
import AuthContext from '~/contexts/auth/AuthContext';
import { type AuthContextType, type AuthUser } from '~/contexts/auth/types';

vi.mock('~/routes/dashboard/dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard" />,
}));

function renderWithAuth(value: AuthContextType | null) {
  const ui =
    value === null ? (
      <MainPage />
    ) : (
      <AuthContext.Provider value={value}>
        <MainPage />
      </AuthContext.Provider>
    );
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('MainPage (with direct AuthContext.Provider)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('returns null when no Provider present', () => {
    const { container } = renderWithAuth(null);
    expect(container.firstChild).toBeNull();
  });

  test('renders welcome when user is null', () => {
    renderWithAuth({ user: null, setUser: vi.fn() });

    expect(
      screen.getByRole('heading', { level: 1, name: /welcome/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/auth\/login$/)
    );
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/auth\/register$/)
    );
  });

  test('renders dashboard and links when user present', () => {
    const user: AuthUser = {
      uid: 'u1',
      displayName: 'Alice',
      email: 'alice@example.com',
    };
    renderWithAuth({ user, setUser: vi.fn() });

    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /rest client/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/client$/)
    );
    expect(screen.getByRole('link', { name: /history/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/history$/)
    );
    expect(screen.getByRole('link', { name: /variables?/i })).toHaveAttribute(
      'href',
      expect.stringMatching(/\/variables$/)
    );
  });
});
