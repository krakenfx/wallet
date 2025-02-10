module.exports = function (api) {
  const presets = [
    [
      'module:@react-native/babel-preset',
      // @see https://solanacookbook.com/integrations/react-native.html
      { unstable_transformProfile: 'hermes-stable' },
    ],
  ];
  const plugins = [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    'error-context',
    'babel-plugin-inline-import',
  ];

  if (process?.env?.JEST_WORKER_ID) {
    // we are inside jest unit tests, provide only basic aliases
    plugins.unshift([
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx', '.json'],
        alias: {
          '@': './src',
          '/': '.',
        },
      },
    ]);
    api.cache.never();
  } else {
    // we are inside RN, so we need to provide unexisting in this runtime modules
    plugins.unshift([
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.android.js', '.android.tsx', '.ios.js', '.ios.tsx', '.json'],
        alias: {
          '@': './src',
          '/': '.',
          crypto: './modules/crypto',
          stream: 'stream-browserify',
        },
      },
    ]);
    api.cache.forever();
  }

  return {
    presets,
    plugins,
    overrides: [
      // fixes "Class private methods are not enabled"
      // @see https://github.com/ethers-io/ethers.js/issues/4307
      {
        test: './node_modules/ethers',
        plugins: [['@babel/plugin-transform-private-methods', { loose: true }]],
      },
    ],
  };
};
