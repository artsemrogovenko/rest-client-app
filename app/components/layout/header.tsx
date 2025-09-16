import { Link } from 'react-router';
import { Button } from '../ui/button';
import useAuth from '~/contexts/auth/useAuth';
import SignOut from '~/routes/auth/sign-out';
import { useEffect, useState } from 'react';
import { SCROLL_THRESHOLD, EVENT_SCROLL } from './constant';
import LanguageToggle from './lang-toggle/Lang-toggle';
import { useTranslation } from 'react-i18next';
import useLangNav from '~/hooks/langLink';

const Header = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { link }  = useLangNav();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);

    window.addEventListener(EVENT_SCROLL, onScroll);
    return () => window.removeEventListener(EVENT_SCROLL, onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="h-10 w-10 bg-black bg-col flex items-center justify-center rounded-sm">
        <Link to={link("")} className="font-semibold text-white">
          H&H
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        {!user && (
          <>
            <Button asChild>
              <Link to={link("auth/login")}>{t('signIn')}</Link>
            </Button>
            <Button asChild>
              <Link to={link("auth/register")}>{t('signUp')}</Link>
            </Button>
          </>
        )}
        {user && (
          <>
            <Button size="sm">
              <Link to={link("")}>{t('main-page')}</Link>
            </Button>
            <SignOut />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
