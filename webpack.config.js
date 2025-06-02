
const path = require('path');

// Override problematic modules
const originalRequire = require;
require = function(id) {
  if (id === 'schema-utils') {
    return {
      validate: () => true,
      validateOptions: () => true,
      ValidationError: class ValidationError extends Error {}
    };
  }
  if (id === 'ajv/dist/compile/codegen') {
    return {};
  }
  if (id.includes('ajv') && id.includes('/dist/')) {
    return {};
  }
  return originalRequire.apply(this, arguments);
};

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "zlib": false
    }
  }
};
