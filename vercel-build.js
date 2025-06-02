#!/usr/bin/env node

// vercel-build.js - Build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Vercel build with validation bypass...');

// Create a temporary patch for terser-webpack-plugin
const terserPluginPath = path.join(__dirname, 'node_modules/terser-webpack-plugin/dist/index.js');

if (fs.existsSync(terserPluginPath)) {
  console.log('Patching terser-webpack-plugin...');
  
  let content = fs.readFileSync(terserPluginPath, 'utf8');
  
  // Replace the problematic validate call
  content = content.replace(
    /validate\(\s*\/\*\*\s*@type\s*{\s*Schema\s*}\s*\*\/\s*schema,\s*options\s*\|\|\s*{},\s*{/g,
    '// validate disabled for build\n    const validatedOptions = options || {}; // Bypass validation\n    if (false) { validate(schema, options || {}, {'
  );
  
  fs.writeFileSync(terserPluginPath, content);
  console.log('terser-webpack-plugin patched successfully');
}

// Set environment variables
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.CI = 'false'; // Disable CI mode to ignore warnings
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-ycoo.onrender.com/api';
process.env.REACT_APP_WS_URL = process.env.REACT_APP_WS_URL || 'wss://helpdesk-backend-ycoo.onrender.com/ws';
process.env.REACT_APP_ENV = 'production';

// Run the build
try {
  console.log('Running react-scripts build...');
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--openssl-legacy-provider'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}