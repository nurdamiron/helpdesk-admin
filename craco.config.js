
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      // Use our comprehensive fix instead of the patch
      'schema-utils$': path.resolve(__dirname, 'schema-utils-fix.js'),
      'schema-utils/dist/validate$': path.resolve(__dirname, 'schema-utils-fix.js')
    },
    configure: (webpackConfig) => {
      // Prevent loading actual schema-utils
      webpackConfig.resolve = webpackConfig.resolve || {};
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'schema-utils': path.resolve(__dirname, 'schema-utils-fix.js'),
        'schema-utils/dist/validate': path.resolve(__dirname, 'schema-utils-fix.js'),
        // Also patch terser-webpack-plugin's validate
        'terser-webpack-plugin': path.resolve(__dirname, 'terser-webpack-plugin-fix.js')
      };
      
      return webpackConfig;
    }
  }
};
