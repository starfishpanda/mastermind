import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import js from '@eslint/js';

export default [
  {
    ignores: ['**/dist/', '**/node_modules/']
  },
  {
    files: ['**/*.{js,ts,tsx}','frontend/**/*.{js,ts,tsx}', 'backend/**/*.{js,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      'prettier': prettierPlugin
    },
    rules: {
      ...js.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        varsIgnorePattern: '^_', 
        argsIgnorePattern: '^_',
        vars: 'all',
        args: 'all'
      }],
      'prettier/prettier': ['error', { 
        endOfLine: 'auto', 
        singleQuote: true, 
        semi: false,
        tabWidth: 2,
        trailingComma: 'es5',
        printWidth: 100
      }]
    }
  }
];
