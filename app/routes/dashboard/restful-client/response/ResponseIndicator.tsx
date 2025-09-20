import { useTranslation } from 'react-i18next';
import type { ReturnResponse } from '~/routes/dashboard/restful-client/types';

export function StatusIndicator(props: ReturnResponse) {
  const { t } = useTranslation();
  const { response } = props;
  const status = response?.status;
  const text = response?.statusText;
  const getStatusColor = () => {
    if (!status) return '';

    const styles = {
      success: 'text-green-500',
      redirect: 'text-blue-400',
      clientError: 'text-orange-400',
      serverError: 'text-red-600',
    };

    if (status >= 200 && status < 300) return styles.success;
    if (status >= 300 && status < 400) return styles.redirect;
    if (status >= 400 && status < 500) return styles.clientError;
    if (status >= 500) return styles.serverError;
    return '';
  };

  return (
    <pre className="rounded-lg border p-2">
      {t('status')} {status ? status : 'N/a'}{' '}
      {text && <span className={getStatusColor()}>{response?.statusText}</span>}
    </pre>
  );
}
