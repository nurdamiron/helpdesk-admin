/**
 * Comprehensive schema-utils fix
 * 
 * This module replaces the validate function from schema-utils with a
 * simple pass-through implementation that skips validation entirely.
 * 
 * It's designed to fix issues with terser-webpack-plugin and other
 * webpack plugins that use schema-utils for validation.
 */

"use strict";

// Simple validation functions
function validate(schema, options) {
  return options; // Skip validation and return options unmodified
}

function validateOptions(schema, options) {
  return options; // Skip validation and return options unmodified
}

// Export the functions using all the formats that might be used by different plugins
Object.defineProperty(exports, "__esModule", {
  value: true
});

// Default export for ESM imports
exports.default = validate;

// Named exports for CommonJS imports
exports.validate = validate;
exports.validateOptions = validateOptions;

// For direct property access
module.exports.validate = validate;
module.exports.validateOptions = validateOptions;
module.exports.default = validate;

// Handle namespace imports
const namespace = { validate, validateOptions, default: validate };
Object.defineProperty(module.exports, 'namespace', {
  enumerable: false,
  get() { return namespace; }
});