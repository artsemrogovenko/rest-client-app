/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import autoprefixer from 'autoprefixer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    open: '/',
    hmr: true,
  },
  build: {
    emptyOutDir: true,
  },
  base: '/',
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },
  optimizeDeps: {
    exclude: ['@react-router/dev', 'app/routes/home.tsx'],
  },
  test: {
    exclude: ['node_modules'],
    coverage: {
      provider: 'v8',
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
    environment: 'jsdom',
    globals: true,
  },
});
