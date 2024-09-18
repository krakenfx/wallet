module.exports = {
  plugins: ['import'],
  rules: {
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-extraneous-dependencies': ['error'],
    'import/no-unresolved': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index', 'type'],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '*.scss',
            group: 'index',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: '/**',
            group: 'object',
            position: 'after',
          },
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: '.',
      },
    },
  },
};
