import { useTranslation } from 'react-i18next';
import useAuth from '~/contexts/auth/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return <div>{t('loading')}</div>;
  }
  return (
    <div className="flex flex-col items-center justify-evenly min-h-60">
      <div>
        {t('welcomeBack')} <span className="font-bold">{user.email}</span>!
      </div>
    </div>
  );
}
