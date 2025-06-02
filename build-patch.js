const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating CRACO config...');

// Create a CRACO config that completely removes optimization
const cracoConfig = `
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Disable optimization completely to avoid terser issues
      webpackConfig.optimization = {
        ...webpackConfig.optimization,
        minimize: false,
        minimizer: []
      };
      
      // Remove any existing terser plugins
      if (webpackConfig.optimization.minimizer) {
        webpackConfig.optimization.minimizer = webpackConfig.optimization.minimizer.filter(
          plugin => !plugin.constructor.name.includes('Terser')
        );
      }
      
      return webpackConfig;
    }
  }
};
`;

// Write the CRACO config
fs.writeFileSync(path.join(__dirname, 'craco.config.js'), cracoConfig);

console.log('🚀 Running build with CRACO...');
try {
  // Install CRACO if not present
  try {
    require.resolve('@craco/craco');
  } catch (e) {
    console.log('Installing @craco/craco...');
    execSync('npm install --no-save @craco/craco', { stdio: 'inherit' });
  }
  
  execSync('npx craco build', { 
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
  console.log('⚠️ CRACO failed, trying simple build without minification...');
  
  // Last resort: try to build with NODE_ENV=development to avoid minification
  try {
    execSync('react-scripts build', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development',
        SKIP_PREFLIGHT_CHECK: 'true',
        DISABLE_ESLINT_PLUGIN: 'true',
        GENERATE_SOURCEMAP: 'false'
      }
    });
    console.log('✅ Build completed successfully (development mode)');
  } catch (finalError) {
    console.error('❌ All build methods failed:', finalError.message);
    process.exit(1);
  }
}