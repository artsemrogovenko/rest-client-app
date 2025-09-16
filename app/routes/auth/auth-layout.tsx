import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { auth } from '~/firebase/firebaseConfig';

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return <Outlet />;
}
