'use client';

import { Button } from '~/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import useLangNav from '~/hooks/langLink';
import logToForm from '~/routes/dashboard/history/utils';
import convertFormToUrl from '~/routes/dashboard/restful-client/utils';
import type { RequestLog, HistoryTableProps } from './types';

export default function HistoryTable({ logs }: HistoryTableProps) {
  const { t } = useTranslation();
  const { link } = useLangNav();
  const navigate = useNavigate();

  const toClientForm = (log: RequestLog) => {
    const formFields = logToForm(log);
    const url = convertFormToUrl(formFields).slice(1);
    navigate(link(url));
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-gray-600">{t('no-history')}</p>
        <p className="text-gray-600 mb-10">{t('empty-here')}</p>
        <Button asChild variant="outline">
          <Link to={link('client')}>{t('restClient')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">{t('timestamp')}</th>
            <th className="border px-4 py-2 text-left">{t('method')}</th>
            <th className="border px-4 py-2 text-left">{t('endpoint')}</th>
            <th className="border px-4 py-2 text-left">{t('status')}</th>
            <th className="border px-4 py-2 text-left">{t('latency')}</th>
            <th className="border px-2 py-1">{t('req-size')}</th>
            <th className="border px-2 py-1">{t('res-size')}</th>
            <th className="border px-2 py-1">{t('tab-error')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <tr
              key={log.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => toClientForm(log)}
            >
              <td className="px-4 py-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="border px-4 py-2 font-semibold">{log.method}</td>
              <td className="border px-4 py-2 text-sm break-all">
                {log.endpoint}
              </td>
              <td
                className={`border px-4 py-2 font-semibold ${
                  typeof log.statusCode === 'number' &&
                  log.statusCode >= 200 &&
                  log.statusCode < 300
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {log.statusCode || 'ERR'}
              </td>
              <td className="border px-4 py-2">
                {log.duration?.toFixed(1) ?? '-'}
              </td>
              <td className="border px-2 py-1">{log.requestSize ?? '-'}</td>
              <td className="border px-2 py-1">{log.responseSize ?? '-'}</td>
              <td className="border px-2 py-1 text-red-500">
                {log.error ?? '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
