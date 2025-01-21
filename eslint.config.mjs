export default [
  {
    root: true,
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    env: {
      es2021: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: false,
        },
      ],
    },
  },
  {
    files: ['frontend/**/*'],
    env: {
      browser: true,
    },
    extends: ['plugin:react/recommended', 'next/core-web-vitals'],
    plugins: ['react'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['backend/**/*'],
    env: {
      node: true,
    },
    rules: {
      'no-console': 'off',
    },
  },
]
