const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Patching terser-webpack-plugin...');

// Find and patch the problematic file
const terserPluginPath = path.join(__dirname, 'node_modules/react-scripts/node_modules/terser-webpack-plugin/dist/index.js');

if (fs.existsSync(terserPluginPath)) {
  let content = fs.readFileSync(terserPluginPath, 'utf8');
  
  // Replace the problematic validation call
  content = content.replace(
    '(0, _schemaUtils.validate)(_options.default, options, {',
    '// Patched validation\n    if (typeof _schemaUtils.validate === "function") {\n      (0, _schemaUtils.validate)(_options.default, options, {'
  );
  
  // Add closing bracket for the if statement
  content = content.replace(
    'name: PLUGIN_NAME\n    });',
    'name: PLUGIN_NAME\n      });\n    }'
  );
  
  fs.writeFileSync(terserPluginPath, content);
  console.log('✅ Patched terser-webpack-plugin successfully');
} else {
  console.log('⚠️ terser-webpack-plugin not found, skipping patch');
}

console.log('🚀 Running build...');
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
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}