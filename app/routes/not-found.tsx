import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import useLangNav from '~/hooks/langLink';

const NotFound = () => {
  const { t } = useTranslation();
  const { link } = useLangNav();
  return (
    <div className="text-center space-y-10">
      <h1 className="text-3xl font-bold">{t('notFound')}</h1>

      <Button asChild>
        <Link to={link('')}>{t('goHome')}</Link>
      </Button>
    </div>
  );
};

export default NotFound;
