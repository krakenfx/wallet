module.exports = {
  printWidth: 160,
  bracketSpacing: true,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.yaml',
      options: {
        singleQuote: false
      }
    },
  ],
};
