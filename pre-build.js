const fs = require('fs');
const path = require('path');

// This script fixes dependency issues for Vercel build
// It adds ajv and ajv-keywords dependencies with specific versions

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Add ajv dependency if it doesn't exist
if (!packageJson.dependencies.ajv) {
  packageJson.dependencies.ajv = "^8.12.0";
}

// Add resolutions section if it doesn't exist
if (!packageJson.resolutions) {
  packageJson.resolutions = {};
}

// Add overrides section if it doesn't exist
if (!packageJson.overrides) {
  packageJson.overrides = {};
}

// Set specific versions for problematic packages
packageJson.resolutions.ajv = "^8.12.0";
packageJson.resolutions['ajv-keywords'] = "^5.1.0";
packageJson.overrides.ajv = "^8.12.0";
packageJson.overrides['ajv-keywords'] = "^5.1.0";

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Updated package.json with dependency fixes for Vercel build');