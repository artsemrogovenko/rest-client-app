import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { isAuth } from '~/services/auth';
import type { User } from 'firebase/auth';

vi.mock('~/firebase/firebaseConfig', () => {
  const unsubscribeMock = vi.fn();
  const onAuthStateChanged = vi.fn<
    (callback: (user: User | null) => void) => () => void
  >((callback) => {
    callback(null);
    return unsubscribeMock;
  });

  return {
    auth: {
      onAuthStateChanged,
    },
    __mock: { onAuthStateChanged, unsubscribeMock },
  };
});

import type { Mock } from 'vitest';

let onAuthStateChanged: Mock;
let unsubscribeMock: Mock;

beforeAll(async () => {
  const mod = await vi.importMock<any>('~/firebase/firebaseConfig');
  onAuthStateChanged = mod.__mock.onAuthStateChanged;
  unsubscribeMock = mod.__mock.unsubscribeMock;
});

describe('isAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves true if user is logged in', async () => {
    const mockUser: User = { uid: '123', email: 'test@example.com' } as User;

    onAuthStateChanged.mockImplementation((callback) => {
      callback(mockUser);
      return unsubscribeMock;
    });

    const result = await isAuth();
    expect(result).toBe(true);
    expect(onAuthStateChanged).toHaveBeenCalled();
  });

  it('resolves false if no user is logged in', async () => {
    onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
      return unsubscribeMock;
    });

    const result = await isAuth();
    expect(result).toBe(false);
    expect(onAuthStateChanged).toHaveBeenCalled();
  });
});
