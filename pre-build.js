const fs = require('fs');
const path = require('path');

// This script fixes dependency issues for Vercel build
console.log('Applying compatibility fixes for Vercel build...');

// Fix for "Unknown keyword formatMinimum" error
// The issue is that ajv-keywords 5.x requires ajv 8.x, but some dependencies use ajv 6.x
// We'll modify package.json to pin specific versions

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add specific versions of ajv dependencies
packageJson.dependencies = packageJson.dependencies || {};
packageJson.dependencies.ajv = "^6.12.6"; // Use 6.x version instead of 8.x
delete packageJson.dependencies['ajv-keywords']; // Remove if exists

// Update resolutions section
packageJson.resolutions = packageJson.resolutions || {};
packageJson.resolutions.ajv = "^6.12.6"; 
delete packageJson.resolutions['ajv-keywords']; // Remove if exists

// Update overrides section
packageJson.overrides = packageJson.overrides || {};
packageJson.overrides.ajv = "^6.12.6";
delete packageJson.overrides['ajv-keywords']; // Remove if exists

// Force specific versions for webpack related packages
packageJson.resolutions['schema-utils'] = "^3.0.0";
packageJson.overrides['schema-utils'] = "^3.0.0";

// Add special npm config for legacy behavior
packageJson.npm = packageJson.npm || {};
packageJson.npm.legacy = {
  "peer-deps": true
};

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json with dependency fixes for Vercel build');