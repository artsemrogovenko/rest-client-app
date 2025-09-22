import ResponseComponent from '~/routes/dashboard/restful-client/response/Response';
import { beforeEach, describe, vi, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { ResponseResult } from '~/routes/dashboard/restful-client/types';

const mockUseAuth = vi.fn();
vi.mock('~/contexts/auth/useAuth.ts', () => ({
  default: () => mockUseAuth(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { changeLanguage: vi.fn() },
  }),
  intestReactI18next: {
    type: 'sample',
    intest: vi.fn(),
  },
}));

const responseOK: ResponseResult = {
  status: 200,
  statusText: 'OK',
  body: 'sample text',
};

describe('ResponseComponent', () => {
  beforeEach(() => {
    cleanup();
  });

  test('should show loading state', () => {
    const { container } = render(
      <ResponseComponent isLoading={true} response={null} error={null} />
    );
    const skeletonClass = '.space-y-2';

    expect(screen.getByText('response')).toBeInTheDocument();
    expect(screen.getByText('status N/a')).toBeInTheDocument();

    const skeleton = container.querySelector(skeletonClass);
    expect(skeleton).toBeInTheDocument();
  });

  test('should show JSON response body', () => {
    const response = {
      status: 200,
      body: { message: 'Success' },
      statusText: 'OK',
    };

    render(
      <ResponseComponent isLoading={false} response={response} error={null} />
    );

    expect(screen.getByText('status 200')).toBeInTheDocument();
    expect(screen.getByText(/"message": "Success"/)).toBeInTheDocument();
  });

  test('should show string response body', () => {
    render(
      <ResponseComponent isLoading={false} response={responseOK} error={null} />
    );

    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  test('show document iframe', () => {
    const htmlContent =
      '<!DOCTYPE html><html><body><h1>Hello World</h1></body></html>';
    const response = {
      status: 200,
      body: htmlContent,
      statusText: 'OK',
    };

    render(
      <ResponseComponent isLoading={false} response={response} error={null} />
    );
    expect(screen.getByTitle('response document')).toBeInTheDocument();
  });

  test('statusText when body is empty', () => {
    const response = {
      status: 204,
      body: '',
      statusText: 'No Content',
    };

    render(
      <ResponseComponent isLoading={false} response={response} error={null} />
    );
    expect(screen.getAllByText('No Content').length).toBe(2);
  });

  test('should handle undefined response body', () => {
    const response = {
      status: 200,
      body: '',
      statusText: 'OK',
    };

    render(
      <ResponseComponent isLoading={false} response={response} error={null} />
    );

    expect(screen.getByText('status 200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
});
