module.exports = {
  dependencies: {
    ...(process.env.NO_FLIPPER === 'true' ? { 'react-native-flipper': { platforms: { ios: null } } } : {}),
  },
};
