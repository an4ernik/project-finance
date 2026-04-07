import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import {defineConfig, globalIgnores} from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'src/shared/api/generated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      pluginReact.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {version: 'detect'},
    },
    rules: {
      // React 19 new JSX transform does not require React in scope
      'react/react-in-jsx-scope': 'off',
      // TypeScript already enforces prop types; this rule is redundant
      'react/prop-types': 'off',
      // Not needed with named arrow functions and fast-refresh HMR
      'react/display-name': 'off',
    },
  },
  prettier,
]);
