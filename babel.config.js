module.exports = function (api) {
  const presets = [['module:metro-react-native-babel-preset', { unstable_transformProfile: 'hermes-stable' }]];
  const plugins = [
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
    'error-context',
  ];

  if (process?.env?.JEST_WORKER_ID) {
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
      {
        test: './node_modules/ethers',
        plugins: [['@babel/plugin-transform-private-methods', { loose: true }]],
      },
    ],
  };
};
