module.exports = {
  plugins: ['prettier', 'jest', 'test-id'],
  extends: ['plugin:jsx-a11y/recommended', 'plugin:react/jsx-runtime'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/display-name': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/prop-types': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'test-id/pascalcase': 'error',
    'jest/no-disabled-tests': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
