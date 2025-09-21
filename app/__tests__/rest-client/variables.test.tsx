import { cleanup, screen, render } from '@testing-library/react';
import Variables from '~/routes/dashboard/variables/Variables';
import AuthProvider from '~/contexts/auth/authProvider';
import type { AuthUser } from '~/contexts/auth/types';
import { afterAll, beforeAll, beforeEach, describe, test, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockUseAuth = vi.fn();
vi.mock('~/contexts/auth/useAuth.ts', () => ({
  default: () => mockUseAuth(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockGetStorageValue = vi.fn();
const mockSetStorageValue = vi.fn();

vi.mock('~/hooks/useLocalStorage', () => ({
  useLocalStorage: () => ({
    getStorageValue: mockGetStorageValue,
    setStorageValue: mockSetStorageValue,
  }),
}));

describe('Variables test page', () => {
  const mockUser: AuthUser = {
    uid: 'gDVbxiIdVzxpn',
    email: 'test@example.com',
    displayName: 'Tester',
  };

  beforeAll(() => {
    mockUseAuth.mockReturnValue({ user: mockUser, setUser: vi.fn() });
  });

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  afterAll(() => {
    localStorage.clear();
  });

  const renderWithProviders = () =>
    render(
      <AuthProvider>
        <Variables />
      </AuthProvider>
    );

  test('Render without variables', async () => {
    renderWithProviders();
    const list = await screen.findByRole('list');
    expect(list.children.length).toBe(0);

    expect(screen.getByText('variable')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
  });

  test('interactivity test', async () => {
    renderWithProviders();

    const addLine = await screen.findByRole('button', { name: 'add' });
    const list = await screen.findByRole('list');
    expect(list.children.length).toBe(0);

    await userEvent.click(addLine);
    expect(list.children.length).toBe(1);

    const saveButton = screen.getByRole('button', { name: 'save' });
    expect(saveButton).toBeInTheDocument();

    const deleteLineButton = list.getElementsByTagName('button')[0];
    await userEvent.click(deleteLineButton);

    expect(
      screen.queryByRole('button', { name: 'save' })
    ).not.toBeInTheDocument();
  });
});
