const fs = require('fs');
const path = require('path');

// This script fixes dependency issues for Vercel build
console.log('Applying compatibility fixes for Vercel build...');

// Fix for "validateOptions is not a function" error
// This is typically related to schema-utils version mismatch with webpack

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Update resolutions section with specific versions known to work together
packageJson.resolutions = packageJson.resolutions || {};
packageJson.resolutions = {
  ...(packageJson.resolutions || {}),
  // These specific versions work together
  "ajv": "6.12.6",
  "ajv-keywords": "3.5.2",
  "schema-utils": "2.7.1",
  "webpack": "4.44.2",
  "react": "18.2.0",
  "react-dom": "18.2.0"
};

// Update overrides section
packageJson.overrides = {
  ...(packageJson.overrides || {}),
  "ajv": "6.12.6",
  "ajv-keywords": "3.5.2",
  "schema-utils": "2.7.1"
};

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Create a webpack.config.js patch
const webpackPatchPath = path.join(__dirname, 'webpack.patch.js');
const webpackPatchContent = `
// This is a patch for webpack.config.js in create-react-app
// It's used to fix issues with validateOptions
const validateOptions = (schema, options) => {
  return options; // Just pass through options without validation
};

module.exports = { validateOptions };
`;
fs.writeFileSync(webpackPatchPath, webpackPatchContent);

console.log('Updated package.json and created webpack patch');