import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import RestfulClientLazy from '~/routes/dashboard/restful-client/RestfulClientLazy';

vi.mock('./RestfulClient', () => ({
  __esModule: true,
  default: () => <div>MockRestfulClient</div>,
}));

vi.mock('react-router', async () => {
  const actual: Record<string, unknown> = await vi.importActual('react-router');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

describe('RestfulClientLazy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders fallback while loading', async () => {
    render(<RestfulClientLazy />);
    expect(screen.getByText('Loading RestfulClient...')).toBeInTheDocument();
  });
});
