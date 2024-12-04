const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
          util: require.resolve('util/'),
          assert: require.resolve('assert/'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          timers: require.resolve('timers-browserify'),
          buffer: require.resolve('buffer/'),
          url: require.resolve('url/')
        }
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        })
      ]
    }
  }
};
