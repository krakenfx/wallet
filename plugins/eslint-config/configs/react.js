module.exports = {
  extends: ['plugin:react/recommended', 'plugin:jsx-a11y/recommended', 'plugin:react/jsx-runtime'],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
