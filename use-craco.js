const fs = require('fs');
const path = require('path');

// This script sets up craco to use instead of react-scripts directly
console.log('Setting up craco configuration...');

// Create craco config file
const cracoConfigPath = path.join(__dirname, 'craco.config.js');
const cracoConfig = `
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add a fallback for validateOptions in schema-utils
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'schema-utils': path.resolve(__dirname, 'schema-utils-patch.js'),
      };
      
      // Disable TerserPlugin validation
      const terserPluginIndex = webpackConfig.optimization.minimizer.findIndex(
        plugin => plugin.constructor.name === 'TerserPlugin'
      );
      
      if (terserPluginIndex !== -1) {
        const options = webpackConfig.optimization.minimizer[terserPluginIndex].options || {};
        // Ensure no validation happens
        webpackConfig.optimization.minimizer[terserPluginIndex] = 
          new (require('terser-webpack-plugin'))({
            ...options,
            // Bypass validation by providing values directly
            terserOptions: {
              parse: {},
              compress: {
                comparisons: false,
                inline: 2
              },
              mangle: true,
              output: {
                comments: false,
                ascii_only: true
              }
            },
            parallel: true
          });
      }
      
      return webpackConfig;
    }
  }
};
`;

fs.writeFileSync(cracoConfigPath, cracoConfig);

// Create schema-utils patch
const schemaUtilsPatchPath = path.join(__dirname, 'schema-utils-patch.js');
const schemaUtilsPatch = `
// Patched schema-utils that skips validation
const validateOptions = (schema, options) => options;
const validate = validateOptions;

module.exports = {
  validate,
  validateOptions,
  default: validate
};
`;

fs.writeFileSync(schemaUtilsPatchPath, schemaUtilsPatch);

// Update package.json scripts to use craco
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = require(packageJsonPath);

// Update scripts to use craco instead of react-scripts
packageJson.scripts.start = "craco start";
packageJson.scripts.dev = "craco start";
packageJson.scripts['start:prod'] = "REACT_APP_ENV=production craco start";
packageJson.scripts.build = "SKIP_PREFLIGHT_CHECK=true CI=false REACT_APP_ENV=production craco build";
packageJson.scripts['build:dev'] = "SKIP_PREFLIGHT_CHECK=true CI=false REACT_APP_ENV=development craco build";

// Write updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

console.log('Setup complete. You can now run "npm run dev" to start the development server with craco.');