import Header from '~/components/layout/header';
import { Outlet } from 'react-router';
import Footer from '~/components/layout/footer';
import AuthProvider from '~/contexts/auth/authProvider';

const AppLayout = () => {
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
