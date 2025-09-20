import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import AuthLayout from '~/routes/auth/auth-layout';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual: Record<string, unknown> = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => <div data-testid="outlet">Mock Outlet</div>,
  };
});

describe('AuthLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <AuthLayout />
      </BrowserRouter>
    );

  it('renders Outlet content', () => {
    renderWithRouter();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });
});
