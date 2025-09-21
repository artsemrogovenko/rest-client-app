import { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { auth } from '~/firebase/firebaseConfig';
import { onAuthStateChanged, type User } from 'firebase/auth';
import type { AuthUser } from './types';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (fbUser: User | null) => {
        if (fbUser) {
          const token = await fbUser.getIdToken();
          document.cookie = `token=${token}; path=/`;
        } else {
          document.cookie = 'token=; Max-Age=0';
        }
        setUser(
          fbUser
            ? {
                displayName: fbUser.displayName,
                email: fbUser.email,
                uid: fbUser.uid,
              }
            : null
        );
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
