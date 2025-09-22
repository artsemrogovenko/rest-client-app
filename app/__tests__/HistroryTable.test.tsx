import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import HistoryTable from '~/routes/dashboard/history/HistoryTable.client';
import { type RequestLog } from '~/routes/dashboard/history/types';

const renderWithRouter = (ui: React.ReactNode) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('HistoryTable', () => {
  const mockLogs: RequestLog[] = [
    {
      id: '1',
      method: 'GET',
      endpoint: '/api/users',
      timestamp: new Date().toISOString(),
      statusCode: 200,
      duration: 123.45,
      requestSize: 100,
      responseSize: 2048,
      error: '',
    },
    {
      id: '2',
      method: 'POST',
      endpoint: '/api/posts',
      timestamp: new Date().toISOString(),
      statusCode: 500,
      duration: 456.78,
      requestSize: 200,
      responseSize: 0,
      error: 'Internal Server Error',
    },
  ];

  it('renders a table with headers', () => {
    renderWithRouter(<HistoryTable logs={mockLogs} />);

    expect(screen.getByText(/timestamp/i)).toBeInTheDocument();
    expect(screen.getByText(/method/i)).toBeInTheDocument();
    expect(screen.getByText(/endpoint/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/latency/i)).toBeInTheDocument();
  });

  it('renders rows for each log', () => {
    renderWithRouter(<HistoryTable logs={mockLogs} />);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('/api/users')).toBeInTheDocument();
    expect(screen.getByText('/api/posts')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
  });
});
