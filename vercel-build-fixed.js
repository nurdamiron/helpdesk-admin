#!/usr/bin/env node

// vercel-build-fixed.js - Robust build script for Vercel deployment
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Vercel build process...');
console.log(`📊 Node.js version: ${process.version}`);
console.log(`📊 Platform: ${process.platform}`);
console.log(`📊 Architecture: ${process.arch}`);

// Step 1: Run comprehensive patches
console.log('\n1️⃣ Applying dependency patches...');
try {
  execSync('node vercel-patch.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to apply patches:', error.message);
  // Continue anyway - some patches might have succeeded
}

// Step 2: Set environment variables
console.log('\n2️⃣ Setting environment variables...');
process.env.SKIP_PREFLIGHT_CHECK = 'true';
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.GENERATE_SOURCEMAP = 'false';
process.env.CI = 'false'; // Disable CI mode
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://helpdesk-backend-ycoo.onrender.com/api';
process.env.REACT_APP_WS_URL = process.env.REACT_APP_WS_URL || 'wss://helpdesk-backend-ycoo.onrender.com/ws';
process.env.REACT_APP_ENV = 'production';

// Node.js 22 specific fixes
if (process.version.startsWith('v22')) {
  console.log('📌 Applying Node.js 22 specific fixes...');
  process.env.NODE_OPTIONS = '--openssl-legacy-provider --no-deprecation';
}

// Step 3: Create a custom webpack configuration override
console.log('\n3️⃣ Creating webpack configuration override...');
const webpackOverridePath = path.join(__dirname, 'webpack-override.js');
fs.writeFileSync(webpackOverridePath, `
// webpack-override.js - Webpack configuration override
module.exports = function override(config, env) {
  // Disable terser-webpack-plugin validation
  if (config.optimization && config.optimization.minimizer) {
    config.optimization.minimizer = config.optimization.minimizer.map(plugin => {
      if (plugin.constructor.name === 'TerserPlugin') {
        // Replace with a simple minifier configuration
        const TerserPlugin = require('terser-webpack-plugin');
        return new TerserPlugin({
          terserOptions: {
            parse: { ecma: 8 },
            compress: { ecma: 5, warnings: false },
            mangle: { safari10: true },
            output: { ecma: 5, comments: false }
          },
          extractComments: false
        });
      }
      return plugin;
    });
  }
  
  // Disable ESLint plugin
  config.plugins = config.plugins.filter(
    plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
  );
  
  return config;
};
`);

// Step 4: Try different build approaches
console.log('\n4️⃣ Running build...');

const buildApproaches = [
  {
    name: 'Standard build with patches',
    command: 'react-scripts build',
    env: {}
  },
  {
    name: 'Build with CRACO',
    command: 'npx craco build',
    env: {},
    preCheck: () => {
      // Create craco.config.js if it doesn't exist
      const cracoConfigPath = path.join(__dirname, 'craco.config.js');
      if (!fs.existsSync(cracoConfigPath)) {
        fs.writeFileSync(cracoConfigPath, `
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable validation in plugins
      if (webpackConfig.optimization && webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer.forEach((plugin) => {
          if (plugin.options && plugin.constructor.name === 'TerserPlugin') {
            // Override the plugin to skip validation
            plugin.options = { ...plugin.options };
          }
        });
      }
      return webpackConfig;
    }
  }
};
`);
      }
      return true;
    }
  },
  {
    name: 'Direct webpack build',
    command: 'npx webpack --config node_modules/react-scripts/config/webpack.config.js --mode production',
    env: {
      NODE_ENV: 'production',
      BABEL_ENV: 'production'
    }
  }
];

let buildSuccess = false;

for (const approach of buildApproaches) {
  console.log(`\n🔧 Trying: ${approach.name}`);
  
  if (approach.preCheck && !approach.preCheck()) {
    console.log('⚠️  Pre-check failed, skipping...');
    continue;
  }
  
  try {
    execSync(approach.command, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...approach.env
      }
    });
    console.log(`✅ Build successful with: ${approach.name}`);
    buildSuccess = true;
    break;
  } catch (error) {
    console.error(`❌ ${approach.name} failed:`, error.message);
    // Continue to next approach
  }
}

// Step 5: Verify build output
if (buildSuccess) {
  console.log('\n5️⃣ Verifying build output...');
  const buildDir = path.join(__dirname, 'build');
  
  if (fs.existsSync(buildDir)) {
    const files = fs.readdirSync(buildDir);
    console.log(`✅ Build directory contains ${files.length} items`);
    console.log('📦 Build completed successfully!');
    process.exit(0);
  } else {
    console.error('❌ Build directory not found!');
    process.exit(1);
  }
} else {
  console.error('\n❌ All build approaches failed!');
  console.log('\n💡 Troubleshooting suggestions:');
  console.log('1. Clear node_modules and reinstall: rm -rf node_modules && npm install --legacy-peer-deps');
  console.log('2. Check Node.js version compatibility');
  console.log('3. Review the error logs above for specific issues');
  process.exit(1);
}