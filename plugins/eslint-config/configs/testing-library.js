module.exports = {
  overrides: [
    {
      files: ['**/*.test.[jt]s?(x)', '**/*.spec.[jt]s?(x)'],
      plugins: ['testing-library'],
      extends: ['plugin:testing-library/react'],
      rules: {
        'testing-library/no-await-sync-events': 'off', 
        'testing-library/no-container': 'warn', 
        'testing-library/no-node-access': 'error',
        'testing-library/prefer-find-by': 'off', 
        'testing-library/prefer-user-event': 'error', 
      },
    },
  ],
};
