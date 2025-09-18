import { useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import i18n from "~/i18n";
import { DEFAULT_LOCALE, isLocale, type Locale } from "~/i18n/config";

const useLangNav = () => {
  const { lang } = useParams();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const currentLang = (isLocale(lang) ? lang : DEFAULT_LOCALE);
 
  const link = useCallback((path = "") => `/${currentLang}/${path}`, [currentLang]);
  const switchLang = useCallback((nextLang: Locale) => {
    if (i18n.language !== nextLang) i18n.changeLanguage(nextLang);

    const part = pathname.split('/');
    if (isLocale(part[1])) part[1] = nextLang;
    else part.splice(1, 0, nextLang);

    navigate(`${part.join('/')}${search}${hash}`);
  }, [pathname, navigate, search, hash]);
  return {currentLang, link, switchLang}
};

export default useLangNav;
