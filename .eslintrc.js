module.exports = {
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@shopify/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['import', 'no-relative-import-paths', 'prettier'],
  ignorePatterns: ['ormconfig.js', 'jest.config.js'],
  rules: {
    'prettier/prettier': ['error'],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/semi': 'warn',
    '@shopify/binary-assignment-parens': 'off',
    'no-console': 'off',
    'no-process-env': 'off',
    'max-params': 'off',
    'line-comment-position': 'off',
    'no-warning-comments': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-cycle': 'off',
    'import/no-duplicates': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['.*', '@/tests/*'],
      },
    ],
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: 'apps/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'infrastructure/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'interfaces/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@tests/apps/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@tests/mothers/**',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'no-relative-import-paths/no-relative-import-paths': ['error', { allowSameFolder: false, rootDir: 'src' }],
    '@typescript-eslint/no-extraneous-class': [
      'error',
      {
        allowStaticOnly: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*Schema.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'off',
          {
            selector: ['objectLiteralProperty'],
          },
        ],
      },
    },
  ],
};
