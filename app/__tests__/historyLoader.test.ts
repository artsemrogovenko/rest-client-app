import { describe, it, expect, vi, beforeEach } from 'vitest';
import { historyLoader } from '~/routes/dashboard/history/historyLoader.server';
import { db } from '~/firebase/firebaseAdmin.server';
import { requireUser } from '~/utils/auth.server';

vi.mock('~/utils/auth.server', () => ({
  requireUser: vi.fn(),
}));

vi.mock('~/firebase/firebaseAdmin.server', () => {
  const mockGet = vi.fn();
  const mockOrderBy = vi.fn(() => ({ get: mockGet }));
  const mockCollection = vi.fn(() => ({
    doc: () => ({ collection: () => ({ orderBy: mockOrderBy }) }),
  }));

  return { db: { collection: mockCollection } };
});

describe('historyLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    (requireUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      null
    );

    const response = await historyLoader({
      request: new Request('http://localhost/'),
      params: {},
    });
    expect(response.status).toBe(401);

    const text = await response.text();
    expect(text).toBe('Unauthorized');
  });

  it('returns 500 if Firestore throws error', async () => {
    (requireUser as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      uid: 'user123',
    });

    const mockGet = vi.fn().mockRejectedValue(new Error('Firestore error'));

    (db.collection as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      doc: () => ({
        collection: () => ({
          orderBy: () => ({ get: mockGet }),
        }),
      }),
    });

    const response = await historyLoader({
      request: new Request('http://localhost/'),
      params: {},
    });
    expect(response.status).toBe(500);

    const text = await response.text();
    expect(text).toBe('Internal Server Error');
  });
});
