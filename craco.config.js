
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'schema-utils$': path.resolve(__dirname, 'schema-utils-patch.js'),
      'schema-utils/dist/validate$': path.resolve(__dirname, 'schema-utils-patch.js')
    },
    configure: (webpackConfig) => {
      // Prevent loading actual schema-utils
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'schema-utils': path.resolve(__dirname, 'schema-utils-patch.js'),
        'schema-utils/dist/validate': path.resolve(__dirname, 'schema-utils-patch.js')
      };
      
      return webpackConfig;
    }
  }
};
