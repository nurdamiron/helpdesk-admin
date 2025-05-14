// This patch provides a fallback for the validateOptions function
// that's referenced in the build process but might be missing
// due to dependency conflicts

// Simple validation function that just returns the options
const validateOptions = (schema, options, path) => {
  return options; // Skip validation and just pass through
};

// Export the validate function for terser-webpack-plugin
const validate = (schema, options) => {
  return options; // Skip validation and just pass through
};

module.exports = { 
  validateOptions,
  validate,
  default: validate
};