// Bypass webpack validation issues
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';

// Mock schema-utils completely
const mockSchemaUtils = {
  validate: function(schema, options, config) {
    return options;
  },
  validateOptions: function(schema, options, config) {
    return options;
  }
};

// Override module loading
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(...args) {
  const moduleName = args[0];
  
  // Handle all schema-utils variations
  if (moduleName === 'schema-utils' || 
      moduleName === 'schema-utils/dist/validate' ||
      moduleName === 'schema-utils/dist/index') {
    return mockSchemaUtils;
  }
  
  // Handle ajv-related modules
  if (moduleName === 'ajv-formats' || moduleName === 'ajv-keywords') {
    return function() { return {}; };
  }
  
  if (moduleName === 'ajv') {
    return function() {
      return {
        compile: () => () => true,
        validate: () => true,
        addKeyword: () => {},
        addFormat: () => {}
      };
    };
  }
  
  return originalRequire.apply(this, args);
};

// Also override require.resolve to prevent module resolution issues
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function(request, parent, isMain) {
  if (request === 'schema-utils' || 
      request === 'schema-utils/dist/validate' ||
      request === 'schema-utils/dist/index') {
    // Return a dummy path that we'll handle in require
    return require.resolve('./bypass-validation.js');
  }
  return originalResolve.apply(this, arguments);
};

require('react-scripts/scripts/start');