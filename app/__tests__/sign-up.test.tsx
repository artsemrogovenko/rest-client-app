import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignUp from '~/routes/auth/sign-up';
import { BrowserRouter } from 'react-router';

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

  it('renders form inputs and button', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
  });

  it('renders link to Sign Up', () => {
    renderWithRouter();
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute(
      'href',
      '/en/auth/login'
    );
  });
});
