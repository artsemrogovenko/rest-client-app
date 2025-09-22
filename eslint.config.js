import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import react from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import prettierEslint from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config([
  globalIgnores(['dist', '.react-router', 'app/components/ui']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-compiler': reactCompiler,
      prettier: prettierEslint,
      'unused-imports': unusedImports,
    },
    ignores: ['node_modules', 'dist', 'vite.config.js', 'eslint.config.mjs'],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-compiler/react-compiler': 'error',
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
