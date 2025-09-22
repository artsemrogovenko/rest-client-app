import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { auth } from '~/firebase/firebaseConfig';
import useLangNav from '~/hooks/langLink';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { link } = useLangNav();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate(link(''));
      }
    });

    return () => unsubscribe();
  }, [navigate, link]);

  return <Outlet />;
}
