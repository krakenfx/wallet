module.exports = {
  extends: [
    '@web3-wallet/eslint-config/base',
    '@web3-wallet/eslint-config/import',
    '@web3-wallet/eslint-config/mobile',
    '@web3-wallet/eslint-config/testing-library',
  ],
  plugins: ['test-id', 'jest'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    'test-id/pascalcase': 'error',
    'jest/no-disabled-tests': 'off',
  },
};
