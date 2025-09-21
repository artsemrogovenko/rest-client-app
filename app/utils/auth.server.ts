import { getAuth } from 'firebase-admin/auth';
import { db } from '~/firebase/firebaseAdmin.server';

export async function requireUser(request: Request) {
  const cookie = request.headers.get('Cookie');

  const token = cookie
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = await getAuth().verifyIdToken(token);

    const userDoc = await db.collection('users').doc(decoded.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    return {
      uid: decoded.uid,
      email: decoded.email,
      ...userData,
    };
  } catch (err) {
    console.error('Auth error:', err);
    return null;
  }
}
