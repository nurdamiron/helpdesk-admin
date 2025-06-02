const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating custom webpack config...');

// Create a webpack config override
const webpackConfigOverride = `
const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
  // Remove terser plugin to avoid validation issues
  config.optimization.minimize = false;
  config.optimization.minimizer = [];
  
  return config;
};
`;

// Write the override file
fs.writeFileSync(path.join(__dirname, 'config-overrides.js'), webpackConfigOverride);

console.log('🚀 Running build with custom config...');
try {
  // Install react-app-rewired if not present
  try {
    require.resolve('react-app-rewired');
  } catch (e) {
    console.log('Installing react-app-rewired...');
    execSync('npm install --no-save react-app-rewired', { stdio: 'inherit' });
  }
  
  execSync('npx react-app-rewired build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_PREFLIGHT_CHECK: 'true',
      DISABLE_ESLINT_PLUGIN: 'true',
      GENERATE_SOURCEMAP: 'false'
    }
  });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.log('⚠️ react-app-rewired failed, trying regular build...');
  try {
    execSync('react-scripts build', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        SKIP_PREFLIGHT_CHECK: 'true',
        DISABLE_ESLINT_PLUGIN: 'true',
        GENERATE_SOURCEMAP: 'false'
      }
    });
    console.log('✅ Build completed successfully');
  } catch (finalError) {
    console.error('❌ Build failed:', finalError.message);
    process.exit(1);
  }
}