module.exports = {
  printWidth: 160,
  jsxBracketSameLine: true,
  singleQuote: true,
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.yaml',
      options: {
        singleQuote: false,
      },
    },
  ],
};
