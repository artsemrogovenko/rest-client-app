/// <reference types="vitest/config" />
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    process.env.VITEST ? [] : reactRouter(),
    tsconfigPaths(),
    viteCommonjs(),
  ],
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
    exclude: ['@react-router/dev', 'app/components/ui'],
    include: ['postman-collection'],
  },
  test: {
    exclude: ['node_modules'],
    setupFiles: './app/__tests__/setupTests.ts',
    coverage: {
      provider: 'v8',
      include: ['app/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'app/**/*.spec.{js,jsx,ts,tsx}',
        'app/index.{js,jsx,ts,tsx}',
        'app/setupTests.{js,ts}',
        'app/**/*.d.ts',
        'app/components/ui',
        '**/*.browser.test.{js,jsx,ts,tsx}',
        'app/root.tsx',
        'app/routes.ts',
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '~': path.resolve(__dirname, './app'),
    },
  },
});
