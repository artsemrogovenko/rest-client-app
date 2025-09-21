import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import useAuth from '~/contexts/auth/useAuth';
import AuthContext from '~/contexts/auth/AuthContext';
import type { AuthUser } from '~/contexts/auth/types';

function TestComponent() {
  const { user } = useAuth();
  return <div>{user ? user.email : 'No user'}</div>;
}

describe('useAuth', () => {
  it('returns context when inside AuthProvider', () => {
    const mockUser: AuthUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Tester',
    };

    render(
      <AuthContext.Provider value={{ user: mockUser, setUser: () => {} }}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('throws error when used outside AuthProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrowError(
      'useAuth must be used within an AuthProvider'
    );

    spy.mockRestore();
  });
});
