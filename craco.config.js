// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add a fallback for validateOptions
      try {
        const schemaUtils = require('schema-utils');
        if (!schemaUtils.validate && !schemaUtils.validateOptions) {
          // If schema-utils doesn't provide validation functions, add our own
          const patch = require('./webpack.config.patch');
          schemaUtils.validateOptions = patch.validateOptions;
        }
      } catch (e) {
        console.warn('Could not patch schema-utils:', e.message);
      }
      
      return webpackConfig;
    }
  }
};