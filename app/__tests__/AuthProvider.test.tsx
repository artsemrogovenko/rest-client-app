import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AuthProvider from '~/contexts/auth/authProvider';

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const renderWithProvider = (childText = 'Test Child') =>
    render(
      <AuthProvider>
        <div>{childText}</div>
      </AuthProvider>
    );

  it('renders children', () => {
    renderWithProvider('Hello World');
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
