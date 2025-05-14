/**
 * Wrapper for terser-webpack-plugin that fixes the "validate is not a function" error
 * 
 * This module intercepts the requires for terser-webpack-plugin and patches the validation
 * function before the original module is initialized.
 */

const path = require('path');
const fs = require('fs');

// Path to the actual terser-webpack-plugin module
const originalModulePath = path.join(
  __dirname, 
  'node_modules', 
  'terser-webpack-plugin', 
  'dist', 
  'index.js'
);

// Load the original module content
let moduleContent = '';
try {
  moduleContent = fs.readFileSync(originalModulePath, 'utf8');
} catch (err) {
  console.error('Could not load terser-webpack-plugin:', err);
  process.exit(1);
}

// Replace the validate call with our pass-through function
const patchedContent = moduleContent.replace(
  /validate\(\s*\/\*\*\s*@type\s*\{Schema\}\s*\*\/\s*schema,\s*options\s*\|\|\s*\{\},\s*\{/g,
  `
  // Patched to skip validation 
  const validate = (schema, options) => options;
  validate(schema, options || {}, {`
);

// Create a module from the patched content
const Module = require('module');
const m = new Module(originalModulePath);
m.filename = originalModulePath;
m.paths = Module._nodeModulePaths(path.dirname(originalModulePath));
m._compile(patchedContent, originalModulePath);

// Export the patched module
module.exports = m.exports;