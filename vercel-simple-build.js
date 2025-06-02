#!/usr/bin/env node

// vercel-simple-build.js - Simple build script for Vercel deployment
const { execSync } = require('child_process');

console.log('Starting simple Vercel build...');

// Set environment variables
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.CI = 'false';
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-ycoo.onrender.com/api';
process.env.REACT_APP_WS_URL = process.env.REACT_APP_WS_URL || 'wss://helpdesk-backend-ycoo.onrender.com/ws';
process.env.REACT_APP_ENV = 'production';

// Run the build without patches
try {
  console.log('Running react-scripts build with minimal configuration...');
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_OPTIONS: '--openssl-legacy-provider --max-old-space-size=4096'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}