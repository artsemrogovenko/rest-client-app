import '~/i18n';
import Header from '~/components/layout/Header';
import { Outlet, useParams } from 'react-router';
import Footer from '~/components/layout/Footer';
import AuthProvider from '~/contexts/auth/authProvider';
import { Toaster } from '~/components/ui/sonner';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AppLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const locale = ['en', 'ru'].includes(lang || '') ? lang : 'en';

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <div className="wrapper">
      <AuthProvider>
        <Header />
        <main className="main">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <Toaster position="bottom-right" offset={80} richColors />
      </AuthProvider>
    </div>
  );
};

export default AppLayout;
