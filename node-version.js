// Check Node.js version and potentially downgrade for compatibility
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Checking Node.js version compatibility...');

try {
  // Create .nvmrc file to set Node.js version for Vercel
  fs.writeFileSync(path.join(__dirname, '.nvmrc'), '16.20.0');
  console.log('Created .nvmrc file with Node.js v16.20.0');

  // Also set engines in package.json
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = require(packageJsonPath);
  
  packageJson.engines = {
    node: ">=16.0.0 <18.0.0"
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated package.json with Node.js engine constraint');

} catch (error) {
  console.error('Error setting Node.js version:', error);
}