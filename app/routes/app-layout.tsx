import Header from '~/components/layout/header';
import { Outlet, useNavigate } from 'react-router';
import Footer from '~/components/layout/footer';
import AuthProvider from '~/contexts/auth/authProvider';
import { useEffect } from 'react';
import { auth } from '~/firebase/firebaseConfig';

const AppLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate('/');
        // } else {
        //   navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <AuthProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </AuthProvider>
  );
};

export default AppLayout;
