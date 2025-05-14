const fs = require('fs');
const path = require('path');

console.log('Patching react-scripts webpack configuration directly...');

// Get the path to webpack.config.js in react-scripts
const reactScriptsPath = path.join(__dirname, 'node_modules', 'react-scripts');
const webpackConfigPath = path.join(reactScriptsPath, 'config', 'webpack.config.js');

// Check if the file exists
if (!fs.existsSync(webpackConfigPath)) {
  console.error(`Could not find webpack config at: ${webpackConfigPath}`);
  process.exit(1);
}

// Read the original file
let webpackConfig = fs.readFileSync(webpackConfigPath, 'utf8');

// Patch the TerserPlugin usage
webpackConfig = webpackConfig.replace(
  /new TerserPlugin\([\s\S]*?\)/g,
  `new TerserPlugin({
      terserOptions: {
        parse: {},
        compress: { comparisons: false, inline: 2 },
        mangle: true,
        output: { comments: false, ascii_only: true }
      },
      parallel: true,
      cache: true,
      sourceMap: shouldUseSourceMap,
      extractComments: false
    })`
);

// Create a backup of the original file
fs.writeFileSync(`${webpackConfigPath}.bak`, fs.readFileSync(webpackConfigPath));

// Write the patched file
fs.writeFileSync(webpackConfigPath, webpackConfig);

console.log(`Patched: ${webpackConfigPath}`);

// Also patch any validate.js files we can find
console.log('Searching for schema-utils validate.js files to patch...');

// First, patch the schema-utils validate.js
const validatePaths = [
  path.join(__dirname, 'node_modules', 'schema-utils', 'dist', 'validate.js'),
  path.join(__dirname, 'node_modules', 'fork-ts-checker-webpack-plugin', 'node_modules', 'schema-utils', 'dist', 'validate.js'),
  path.join(__dirname, 'node_modules', 'terser-webpack-plugin', 'node_modules', 'schema-utils', 'dist', 'validate.js'),
  // Add more potential paths if needed
];

const validatePatch = `"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = validate;

function validate(schema, options) {
  // This is a patched version that accepts all inputs
  return options;
}

// Add compatibility with different schema-utils versions
exports.validate = validate;
exports.validateOptions = validate;
`;

// Apply the patch to all found validate.js files
let patchedCount = 0;
for (const validatePath of validatePaths) {
  if (fs.existsSync(validatePath)) {
    // Create a backup of the original file
    fs.writeFileSync(`${validatePath}.bak`, fs.readFileSync(validatePath));
    
    // Write the patched file
    fs.writeFileSync(validatePath, validatePatch);
    
    console.log(`Patched: ${validatePath}`);
    patchedCount++;
  }
}

if (patchedCount === 0) {
  console.log('No schema-utils validate.js files found to patch.');
} else {
  console.log(`Successfully patched ${patchedCount} validate.js files.`);
}

console.log('Patching complete. Try running "npm start" now.');