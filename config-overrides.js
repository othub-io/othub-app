// // config-overrides.js
// const { override, addWebpackAlias } = require('customize-cra');
// const path = require('path');

// module.exports = override(
//   addWebpackAlias({
//     buffer: require.resolve('buffer/'),
//     path: require.resolve('path-browserify'),
//   })
// );
const webpack = require('webpack');

module.exports = function override(config, env) {
  // Polyfill Buffer for use in the browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    buffer: require.resolve('buffer/')
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ];

  return config;
};

