import { db } from '~/firebase/firebaseAdmin.server';
import { requireUser } from '~/utils/auth.server';

export async function historyLoader({
  request,
}: {
  request: Request;
  params: Record<string, string>;
}) {
  try {
    const user = await requireUser(request);
    if (!user) return new Response('Unauthorized', { status: 401 });

    const snapshot = await db
      .collection('users')
      .doc(user.uid)
      .collection('logs')
      .orderBy('timestamp', 'desc')
      .get();

    const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return new Response(JSON.stringify({ logs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('History loader error:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
