import '@testing-library/jest-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SignIn from '~/routes/auth/sign-in';
import { BrowserRouter } from 'react-router';

describe('SignIn Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

  it('renders form inputs and button', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it('renders link to Sign Up', () => {
    renderWithRouter();
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute(
      'href',
      '/en/auth/register'
    );
  });
});
