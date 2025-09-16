'use server';

import React, { useEffect, useState } from 'react';
import { auth, db } from '~/firebase/firebaseConfig';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { type RequestLog } from './types';
import { Button } from '~/components/ui/button';
import { Link, useNavigate } from 'react-router';
import logToForm from '~/routes/dashboard/history/utils';
import convertFormToUrl from '~/routes/dashboard/restful-client/utils';

export default function HistoryTable() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const userId = auth.currentUser?.uid || '';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      const q = query(
        collection(db, 'users', userId, 'logs'),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as RequestLog
      );
      setLogs(data);
    };

    fetchLogs();
  }, []);

  const toClientForm = (log: RequestLog) => {
    const formFields = logToForm(log);
    const url = convertFormToUrl(formFields);
    navigate(url);
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-gray-600">
          You haven&apos;t executed any requests yet
        </p>
        <p className="text-gray-600 mb-10">It&apos;s empty here. Try: </p>
        <Button asChild variant="outline">
          <Link to="/client">REST Client</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Timestamp</th>
            <th className="px-4 py-2 text-left">Method</th>
            <th className="px-4 py-2 text-left">Endpoint</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Latency (ms)</th>
            <th className="border px-2 py-1">Req Size</th>
            <th className="border px-2 py-1">Res Size</th>
            <th className="border px-2 py-1">Error</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <React.Fragment key={log.id}>
              <tr
                className="hover:bg-gray-50"
                onClick={() => toClientForm(log)}
              >
                <td className="px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 font-semibold">{log.method}</td>
                <td className="px-4 py-2 text-sm break-all">{log.endpoint}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    log.statusCode &&
                    log.statusCode >= 200 &&
                    log.statusCode < 300
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {log.statusCode || 'ERR'}
                </td>
                <td className="px-4 py-2">{log.duration.toFixed(1)}</td>
                <td className="border px-2 py-1">{log.requestSize}</td>
                <td className="border px-2 py-1">{log.responseSize}</td>
                <td className="border px-2 py-1 text-red-500">
                  {log.error ?? '-'}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
