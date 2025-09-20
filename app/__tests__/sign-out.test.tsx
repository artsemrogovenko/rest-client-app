import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import SignOut from '~/routes/auth/sign-out';

vi.mock('firebase/auth', () => ({
  signOut: vi.fn(),
}));

vi.mock('~/firebase/firebaseConfig', () => ({
  auth: {},
}));

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual: Record<string, unknown> = await import('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('~/components/ui/button', () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

import { signOut } from 'firebase/auth';

describe('SignOut Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <SignOut />
      </BrowserRouter>
    );

  it('renders sign out button', () => {
    renderWithRouter();
    expect(
      screen.getByRole('button', { name: /sign out/i })
    ).toBeInTheDocument();
  });

  it("calls Firebase signOut and navigates to '/' on success", async () => {
    (signOut as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

    renderWithRouter();
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({});
      expect(mockNavigate).toHaveBeenCalledWith('/en/');
    });
  });
});
