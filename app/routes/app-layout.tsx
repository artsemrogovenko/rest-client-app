import '~/i18n';
import Header from '~/components/layout/Header';
import { Outlet, useParams } from 'react-router';
import Footer from '~/components/layout/Footer';
import AuthProvider from '~/contexts/auth/authProvider';
import { Toaster } from '~/components/ui/sonner';
import { Suspense, useEffect } from 'react';
import { DEFAULT_LOCALE, isLocale } from '~/i18n/config';
import i18n from '~/i18n';

const AppLayout = () => {
  const { lang } = useParams();
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE;

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale);
  }, [locale]);

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
