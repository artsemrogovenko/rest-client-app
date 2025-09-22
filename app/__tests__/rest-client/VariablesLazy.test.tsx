import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VariablesLazy from '~/routes/dashboard/variables/VariablesLazy';

vi.mock('./Variables', () => ({
  __esModule: true,
  default: () => <div>MockVariables</div>,
}));

vi.mock('react-router', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

describe('VariablesLazy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fallback while loading', async () => {
    render(<VariablesLazy />);
    expect(screen.getByText('Loading variables...')).toBeInTheDocument();
  });
});
