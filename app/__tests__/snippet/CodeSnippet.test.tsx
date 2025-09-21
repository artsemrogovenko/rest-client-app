import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import {
  useForm,
  type UseFormReturn,
  FormProvider,
  type Resolver,
} from 'react-hook-form';
import CodeSnippet from '~/routes/dashboard/snippet/CodeSnippet';

interface FormValues {
  method?: string;
  endpoint?: string;
  header?: { name: string; value: string }[];
  variable?: { name: string; value: string }[];
  type?: string;
  body?: string;
  language?: string;
  snippet?: string;
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('~/hooks/langLink', () => ({
  default: () => ({ link: (p: string) => `/en/${p}` }),
}));

const validateValuesSpy = vi.fn<(form: UseFormReturn<FormValues>) => void>();
vi.mock('~/routes/dashboard/restful-client/hooks', () => ({
  useVariablesValidator: () => ({
    validateValues: validateValuesSpy,
    variables: { TOKEN: 'abc123' },
  }),
}));

const convertValuesSpy = vi.fn<(values: unknown, vars: unknown) => void>();
vi.mock('~/routes/dashboard/restful-client/utils', () => ({
  convertValues: (values: unknown, vars: unknown) =>
    convertValuesSpy(values, vars),
}));

vi.mock('~/routes/dashboard/snippet/LanguagesList', () => ({
  default: () => (
    <>
      <option value="js&Fetch">JS Fetch</option>
      <option value="py&Requests">Python Requests</option>
    </>
  ),
}));

vi.mock('~/components/ui/select', () => {
  const Select: React.FC<{
    value?: string;
    onValueChange?: (v: string) => void;
    children: React.ReactNode;
  }> = ({ value, onValueChange, children }) => (
    <select
      data-testid="lang-select"
      value={value ?? ''}
      onChange={(e) => onValueChange?.(e.target.value)}
    >
      {children}
    </select>
  );

  const SelectTrigger: React.FC<{
    id?: string;
    className?: string;
    children: React.ReactNode;
  }> = ({ children }) => <>{children}</>;
  const SelectContent: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <>{children}</>;
  const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => (
    <span data-testid="select-value">{placeholder ?? ''}</span>
  );
  return { Select, SelectTrigger, SelectContent, SelectValue };
});

const toastMessageSpy = vi.fn<(msg: string) => void>();
vi.mock('sonner', () => ({
  toast: { message: (msg: string) => toastMessageSpy(msg) },
}));

const fetchMock =
  vi.fn<(input: RequestInfo | URL, init?: RequestInit) => Promise<Response>>();
const writeTextMock = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  fetchMock.mockReset();
  writeTextMock.mockReset();
  globalThis.fetch = fetchMock;
  (
    globalThis.navigator as Navigator & {
      clipboard: Clipboard & { writeText: (text: string) => Promise<void> };
    }
  ).clipboard = {
    writeText: writeTextMock,
    read: vi.fn(),
    readText: vi.fn(),
    write: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
  validateValuesSpy.mockClear();
  convertValuesSpy.mockClear();
});

function Host({ initialSnippet }: { initialSnippet?: string }) {
  const resolver: Resolver<FormValues> = async (values) => {
    return { values, errors: {} };
  };

  const form: UseFormReturn<FormValues> = useForm<FormValues>({
    mode: 'onChange',
    resolver,
    defaultValues: {
      endpoint: 'https://example.com',
      method: 'GET',
      header: [],
      type: 'json',
      body: '',
      language: 'js&Fetch',
      snippet: initialSnippet,
    },
  });
  React.useEffect(() => {
    void form.trigger(['endpoint', 'header', 'type', 'body', 'language']);
  }, [form]);

  return (
    <FormProvider {...form}>
      <CodeSnippet form={form} />
    </FormProvider>
  );
}

function HostValid({ initialSnippet }: { initialSnippet?: string }) {
  const resolver: Resolver<FormValues> = async (values) => ({
    values,
    errors: {},
  });

  const form = useForm<FormValues>({
    mode: 'onChange',
    resolver,
    defaultValues: {
      endpoint: 'https://example.com',
      method: 'GET',
      header: [],
      type: 'json',
      body: '',
      language: 'js&Fetch',
      snippet: initialSnippet,
    },
  });

  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      await form.trigger(['endpoint', 'header', 'type', 'body', 'language']);
      await Promise.resolve();
      setReady(true);
    })();
  }, [form]);

  if (!ready) return null;

  return (
    <FormProvider {...form}>
      <CodeSnippet form={form as UseFormReturn<FormValues>} />
    </FormProvider>
  );
}

describe('CodeSnippet', () => {
  test('CodeSnippet is displayed', () => {
    render(<Host />);

    expect(screen.getByText('generate-code')).toBeInTheDocument();
    expect(screen.getByText('select-language')).toBeInTheDocument();
  });

  test('Renders a button and a SelectValue component', () => {
    render(<Host />);
    expect(screen.getByText('generate-code')).toBeInTheDocument();
    expect(screen.getByTestId('select-value')).toHaveTextContent('js Fetch');
  });

  test('On clicking Generate, it displays a snippet', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('SNIPPET_OK', { status: 200 })
    );

    render(<HostValid />);

    await screen.findByText('generate-code');

    const select = (await screen.findByTestId(
      'lang-select'
    )) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'py&Requests' } });
    await waitFor(() => expect(select.value).toBe('py&Requests'));

    fireEvent.click(screen.getByText('generate-code'));

    await waitFor(() => {
      expect(validateValuesSpy).toHaveBeenCalledTimes(1);
      expect(convertValuesSpy).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toBe('/en/api/code');
      expect((init as RequestInit).method).toBe('POST');
      expect((init as RequestInit).body).toBeInstanceOf(FormData);
      expect(screen.getByText('SNIPPET_OK')).toBeInTheDocument();
      expect(screen.getByText('copy-code')).toBeInTheDocument();
    });
  });

  test('To copy snippet and to show the toast', async () => {
    render(<Host initialSnippet="ALREADY_SNIPPET" />);

    fireEvent.click(screen.getByText('copy-code'));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith('ALREADY_SNIPPET');
      expect(toastMessageSpy).toHaveBeenCalledWith('copied');
    });
  });
});
