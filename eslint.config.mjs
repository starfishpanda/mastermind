import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import js from '@eslint/js';

export default [
  {
    ignores: ['frontend/dist/', 'backend/dist/', 'node_modules/', 'eslint.config.mjs']
  },
  // Base ESLint recommended config
  js.configs.recommended,
  
  // Base configuration for all files
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.es2021,
        ...globals.jest
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'prettier': prettierPlugin
    },
    rules: {
      ...tsPlugin.configs['recommended'].rules,
      ...prettierPlugin.configs['recommended'].rules,
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: false
        }
      ],
      '@typescript-eslint/no-unused-vars': [
      'warn', // Change to 'off' to disable completely, or 'error' for strict enforcement
      { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }, // Allow variables or arguments prefixed with `_`
    ],
    'no-unused-vars': 'off', // Disable the base ESLint rule in favor of the TypeScript-specific one
  },
  },
  
  // Frontend-specific configuration
  {
    files: ['frontend/**/*.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs['recommended'].rules,
      ...reactHooksPlugin.configs['recommended'].rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  
  // Backend-specific configuration
  {
    files: ['backend/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off'
    }
  }
];