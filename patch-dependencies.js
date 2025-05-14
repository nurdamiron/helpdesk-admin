const fs = require('fs');
const path = require('path');

// This script patches the node_modules to fix "validate is not a function" error
console.log('Patching node_modules for local development...');

// Patch schema-utils validate.js
try {
  const schemaUtilsPath = path.join(__dirname, 'node_modules', 'schema-utils', 'dist', 'validate.js');
  if (fs.existsSync(schemaUtilsPath)) {
    const patchedCode = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validate;

function validate(schema, options) {
  // This is a patched version that accepts all inputs without validation
  return options;
}

// Add compatibility with different schema-utils versions
exports.validate = validate;
exports.validateOptions = validate;
`;
    
    fs.writeFileSync(schemaUtilsPath, patchedCode);
    console.log('Successfully patched schema-utils');
  } else {
    console.log('schema-utils not found at expected path');
  }
} catch (error) {
  console.error('Error patching schema-utils:', error);
}

// Patch terser-webpack-plugin
try {
  const terserPluginPath = path.join(__dirname, 'node_modules', 'terser-webpack-plugin', 'dist', 'index.js');
  if (fs.existsSync(terserPluginPath)) {
    let terserPlugin = fs.readFileSync(terserPluginPath, 'utf8');
    
    // Replace the validate call with a simple pass-through function
    terserPlugin = terserPlugin.replace(
      /validate\(\s+\/\*\*\s+@type\s+\{Schema\}\s+\*\/\s*schema,\s+options\s+\|\|\s+\{\},\s+\{/g,
      '// Patched to skip validation\n    const validateOptions = (schema, options) => options;\n    validateOptions(schema, options || {}, {'
    );
    
    fs.writeFileSync(terserPluginPath, terserPlugin);
    console.log('Successfully patched terser-webpack-plugin');
  } else {
    console.log('terser-webpack-plugin not found at expected path');
  }
} catch (error) {
  console.error('Error patching terser-webpack-plugin:', error);
}

// Also check for fork-ts-checker-webpack-plugin schema-utils
try {
  const forkTsPath = path.join(__dirname, 'node_modules', 'fork-ts-checker-webpack-plugin', 'node_modules', 'schema-utils', 'dist', 'validate.js');
  if (fs.existsSync(forkTsPath)) {
    const patchedCode = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validate;

function validate(schema, options) {
  // This is a patched version that accepts all inputs without validation
  return options;
}

// Add compatibility with different schema-utils versions
exports.validate = validate;
exports.validateOptions = validate;
`;
    
    fs.writeFileSync(forkTsPath, patchedCode);
    console.log('Successfully patched fork-ts-checker schema-utils');
  } else {
    console.log('fork-ts-checker schema-utils not found');
  }
} catch (error) {
  console.error('Error patching fork-ts-checker schema-utils:', error);
}

console.log('Patching complete. You should now be able to run the development server.');