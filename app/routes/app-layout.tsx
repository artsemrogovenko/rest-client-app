import Header from '~/components/layout/header';
import { Outlet } from 'react-router';
import Footer from '~/components/layout/footer';
import AuthProvider from '~/contexts/auth/authProvider';
import { Toaster } from '~/components/ui/sonner';

const AppLayout = () => {
  return (
    <div className="wrapper">
      <AuthProvider>
        <Header />
        <main className="main">
          <Outlet />
        </main>
        <Footer />
        <Toaster position="bottom-right" offset={80} richColors />
      </AuthProvider>
    </div>
  );
};

export default AppLayout;
