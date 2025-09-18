import { useContext } from 'react';
import AuthContext from '~/contexts/auth/AuthContext';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import Dashboard from './dashboard/dashboard';
import { useTranslation } from 'react-i18next';
import useLangNav from '~/hooks/langLink';

const MainPage = () => {
  const { t } = useTranslation();
  const { link } = useLangNav();
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { user } = auth;

  return (
    <div className="flex flex-col items-center gap-8 w-[90%] max-w-xl flex-1 text-center">
      {!user ? (
        <>
          <h1 className="text-center font-bold text-3xl">{t('welcome')}</h1>
          <div className="flex gap-4">
            <Button asChild>
              <Link to={link("auth/login")}>{t('signIn')}</Link>
            </Button>
            <Button asChild>
              <Link to={link("auth/register")}>{t('signUp')}</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <Dashboard />
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline">
              <Link to={link("client")}>{t('restClient')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={link("history")}>{t('history')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to={link("variables")}>{t('variables')}</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MainPage;
