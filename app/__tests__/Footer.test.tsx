import { describe, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Footer from '../components/layout/Footer';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        developed: 'Developed by',
        artsemrogovenko: 'artsemrogovenko',
        'vsv-noon': 'vsv-noon',
        'christopher-0118': 'christopher-0118',
      };
      return dict[key] ?? key;
    },
  }),
}));

describe('Footer', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Footer is present', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(screen.getByText('Developed by')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
  });

  test('GitHub-links are present', () => {
    render(<Footer />);

    const a1 = screen.getByText('artsemrogovenko').closest('a');
    const a2 = screen.getByText('vsv-noon').closest('a');
    const a3 = screen.getByText('christopher-0118').closest('a');

    expect(a1).toHaveAttribute('href', 'https://github.com/artsemrogovenko');
    expect(a2).toHaveAttribute('href', 'https://github.com/vsv-noon');
    expect(a3).toHaveAttribute('href', 'https://github.com/christopher-0118');
  });

  test('Links to RS School', () => {
    render(<Footer />);

    const img = screen.getByAltText('RS School Logo');
    expect(img).toBeInTheDocument();

    const link = img.closest('a');
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });
});
