import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireUser } from '~/utils/auth.server';
import { getAuth } from 'firebase-admin/auth';
import { db } from '~/firebase/firebaseAdmin.server';

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('~/firebase/firebaseAdmin.server', () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe('requireUser', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns null if no token in cookie', async () => {
    const request = new Request('http://localhost/', {
      headers: { Cookie: '' },
    });
    const user = await requireUser(request);
    expect(user).toBeNull();
  });

  it('returns null if token is invalid', async () => {
    const verifyIdToken = vi.fn().mockRejectedValue(new Error('Invalid token'));
    (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      verifyIdToken,
    });

    const request = new Request('http://localhost/', {
      headers: { Cookie: 'token=badtoken' },
    });

    const user = await requireUser(request);
    expect(user).toBeNull();
    expect(verifyIdToken).toHaveBeenCalledWith('badtoken');
  });

  it('returns user data if token is valid and user exists in DB', async () => {
    const decoded = { uid: 'user123', email: 'test@example.com' };
    const verifyIdToken = vi.fn().mockResolvedValue(decoded);
    (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      verifyIdToken,
    });

    const mockGet = vi.fn().mockResolvedValue({
      exists: true,
      data: () => ({ role: 'admin' }),
    });
    (db.collection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      doc: () => ({ get: mockGet }),
    });

    const request = new Request('http://localhost/', {
      headers: { Cookie: 'token=validtoken' },
    });

    const user = await requireUser(request);
    expect(user).toEqual({
      uid: 'user123',
      email: 'test@example.com',
      role: 'admin',
    });

    expect(verifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockGet).toHaveBeenCalled();
  });

  it('returns user object with empty data if DB doc does not exist', async () => {
    const decoded = { uid: 'user123', email: 'test@example.com' };
    const verifyIdToken = vi.fn().mockResolvedValue(decoded);
    (getAuth as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      verifyIdToken,
    });

    const mockGet = vi.fn().mockResolvedValue({ exists: false });
    (db.collection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      doc: () => ({ get: mockGet }),
    });

    const request = new Request('http://localhost/', {
      headers: { Cookie: 'token=validtoken' },
    });

    const user = await requireUser(request);
    expect(user).toEqual({
      uid: 'user123',
      email: 'test@example.com',
    });

    expect(verifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockGet).toHaveBeenCalled();
  });
});
