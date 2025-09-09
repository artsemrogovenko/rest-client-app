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
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setUser(
        user
          ? {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
            }
          : null
      );
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
