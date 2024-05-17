module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['test-id', 'import'],
  "rules": {
    "react-native/no-inline-styles": "off",
    'test-id/pascalcase': 'error',
    'jest/no-disabled-tests':'off',
    "@typescript-eslint/no-explicit-any": "warn",
    "sort-imports": ["error", { "ignoreDeclarationSort": true }],
    "import/newline-after-import": ["error", { "count": 1 }],
    'import/no-extraneous-dependencies': 'error',
    'import/order': [
      'error',
      {
        "newlines-between": "always-and-inside-groups",
        alphabetize: {
          order: 'asc',
          caseInsensitive: true 
        },
        groups: [
          'external',
          'builtin',
          'internal',
          'parent',
          'sibling',
          'index',
          'type'
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
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
};
