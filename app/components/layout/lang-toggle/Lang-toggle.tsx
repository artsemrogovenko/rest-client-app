import { useTranslation } from 'react-i18next';
import { Button } from '~/components/ui/button';
import useLangNav from '~/hooks/langLink';

const LanguageToggle = () => {
  const { t } = useTranslation();
  const { currentLang, switchLang } = useLangNav();
  const nextLang = currentLang === 'en' ? 'ru' : 'en';

  return (
    <Button variant="outline" size="sm" onClick={() => switchLang(nextLang)}>
      {t(currentLang)}
    </Button>
  );
}

export default LanguageToggle;
