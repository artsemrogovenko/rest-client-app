/// <reference types="@vitest/browser/context" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    reporters: ['html'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './app/__tests__/setupTests.ts',
    exclude: ['node_modules', 'app/components/ui', 'scripts/commit.test.ts'],
    browser: {
      enabled: true,
      provider: 'preview',
      instances: [{ browser: 'chromium' }],
    },
    deps: {
      optimizer: {
        ssr: {
          include: [
            '@testing-library/react',
            '@testing-library/jest-dom',
            '@testing-library/user-event',
            'react-i18next',
          ],
        },
      },
    },
    coverage: {
      provider: 'istanbul',
      include: ['app/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'app/**/*.spec.{js,jsx,ts,tsx}',
        'app/index.{js,jsx,ts,tsx}',
        'app/setupTests.{js,ts}',
        'app/**/*.d.ts',
        'app/components/ui',
      ],
      thresholds: {
        statements: 80,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '~': path.resolve(__dirname, './app'),
    },
  },
});
