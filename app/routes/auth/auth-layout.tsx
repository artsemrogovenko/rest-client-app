import { Outlet, useNavigate } from 'react-router'
import React, { useEffect } from 'react'
import { auth } from '~/firebase/firebaseConfig';


export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return (
    <div>
      <Outlet />
    </div>
  )
}
