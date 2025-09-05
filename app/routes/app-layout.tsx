import Header from '~/components/layout/header';
import { Outlet } from 'react-router';
import Footer from '~/components/layout/footer';

const AppLayout = () => {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
