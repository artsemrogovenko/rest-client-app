import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { auth } from '~/firebase/firebaseConfig';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return (
    <>
      <div>
        <Outlet />
      </div>
      {children}
    </>
  )
}
