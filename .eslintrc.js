module.exports = {
  extends: [
    '@web3-wallet/eslint-config/base',
    '@web3-wallet/eslint-config/import',
    '@web3-wallet/eslint-config/mobile',
    '@web3-wallet/eslint-config/testing-library',
    '@web3-wallet/eslint-config/overrides',
    // Currently has a conflict with typescript-eslint
    // '@web3-wallet/eslint-config/storybook',
  ],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};
