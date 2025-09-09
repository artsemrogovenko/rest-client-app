import Header from '~/components/layout/header';
import { Outlet } from 'react-router';
import Footer from '~/components/layout/footer';
import AuthProvider from '~/contexts/auth/authProvider';
import { Toaster } from '~/components/ui/sonner';

const AppLayout = () => {

  return (
    <>
      <AuthProvider>
        <div className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center gap-12 px-4 py-8 text-center">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
      <Toaster position="bottom-right" offset={80} richColors />
    </>
  );
};

export default AppLayout;
