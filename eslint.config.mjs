// import globals from 'globals';
// import tsPlugin from '@typescript-eslint/eslint-plugin';
// import tsParser from '@typescript-eslint/parser';
// import reactPlugin from 'eslint-plugin-react';
// import reactHooksPlugin from 'eslint-plugin-react-hooks';
// import prettierPlugin from 'eslint-plugin-prettier';
// import js from '@eslint/js';

// export default [
//   {
//     ignores: ['**/dist/', '**/node_modules/']
//   },
//   // Frontend configuration
//   {
//     files: ['frontend/**/*.{js,ts,tsx}'],
//     languageOptions: {
//       parser: tsParser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         project: './frontend/tsconfig.json'
//       },
//       globals: {
//         ...globals.browser,
//         ...globals.es2021
//       }
//     },
//     plugins: {
//       '@typescript-eslint': tsPlugin,
//       'react': reactPlugin,
//       'react-hooks': reactHooksPlugin,
//       'prettier': prettierPlugin
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tsPlugin.configs.recommended.rules,
//       ...reactPlugin.configs.recommended.rules,
//       ...reactHooksPlugin.configs.recommended.rules,
//       'react/react-in-jsx-scope': 'off',
//       'react/prop-types': 'off',
//       'prettier/prettier': ['error', { 
//         endOfLine: 'auto', 
//         singleQuote: true, 
//         semi: false 
//       }],
//       '@typescript-eslint/no-unused-vars': ['warn', { 
//         varsIgnorePattern: '^_', 
//         argsIgnorePattern: '^_' 
//       }]
//     },
//     settings: {
//       react: {
//         version: 'detect'
//       }
//     }
//   },
//   // Backend configuration
//   {
//     files: ['backend/**/*.{js,ts}'],
//     languageOptions: {
//       parser: tsParser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//         project: './backend/tsconfig.json'
//       },
//       globals: {
//         ...globals.node,
//         ...globals.es2021
//       }
//     },
//     plugins: {
//       '@typescript-eslint': tsPlugin,
//       'prettier': prettierPlugin
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tsPlugin.configs.recommended.rules,
//       'no-console': 'off',
//       'prettier/prettier': ['error', { 
//         endOfLine: 'auto', 
//         singleQuote: true, 
//         semi: false 
//       }],
//       '@typescript-eslint/no-unused-vars': ['warn', { 
//         varsIgnorePattern: '^_', 
//         argsIgnorePattern: '^_' 
//       }]
//     }
//   }
// ];

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
    files: ['**/*.{js,ts,tsx}'],
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
      }]
    }
  }
];