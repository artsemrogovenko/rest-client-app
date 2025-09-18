import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { auth } from '~/firebase/firebaseConfig';
import useLangNav from '~/hooks/langLink';

export default function AuthLayout() {
  const { link } = useLangNav();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate(link(''));
      }
    });

    return () => unsubscribe();
  }, [link, navigate]);
  return <Outlet />;
}
