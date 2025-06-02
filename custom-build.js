const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Creating minimal custom build...');

// Create a simple webpack config that bypasses react-scripts entirely
const webpackConfig = `
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    publicPath: '/',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\\.(png|jpe?g|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/media/[name].[hash][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true
    })
  ],
  optimization: {
    minimize: false, // Disable minification to avoid terser issues
    splitChunks: {
      chunks: 'all'
    }
  }
};
`;

fs.writeFileSync(path.join(__dirname, 'webpack.custom.js'), webpackConfig);

console.log('🚀 Installing build dependencies...');

try {
  // Install required build dependencies
  execSync('npm install --no-save webpack webpack-cli html-webpack-plugin babel-loader @babel/core @babel/preset-env @babel/preset-react style-loader css-loader', { stdio: 'inherit' });
  
  console.log('📦 Running custom webpack build...');
  execSync('npx webpack --config webpack.custom.js', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  // Copy public files
  console.log('📁 Copying public assets...');
  if (fs.existsSync('./public')) {
    execSync('cp -r ./public/* ./build/ 2>/dev/null || true', { stdio: 'inherit' });
  }
  
  // Create manifest.json if it doesn't exist
  const manifestPath = path.join(__dirname, 'build', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    const manifest = {
      short_name: "Helpdesk Admin",
      name: "Helpdesk Admin Panel",
      start_url: ".",
      display: "standalone",
      theme_color: "#000000",
      background_color: "#ffffff"
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }
  
  console.log('✅ Custom build completed successfully');
} catch (error) {
  console.error('❌ Custom build failed:', error.message);
  
  // Final fallback - try with older react-scripts
  console.log('🔄 Trying final fallback with react-scripts 4.x...');
  try {
    execSync('npm install --no-save react-scripts@4.0.3', { stdio: 'inherit' });
    execSync('react-scripts build', { 
      stdio: 'inherit',
      env: {
        ...process.env,
        SKIP_PREFLIGHT_CHECK: 'true',
        DISABLE_ESLINT_PLUGIN: 'true',
        GENERATE_SOURCEMAP: 'false'
      }
    });
    console.log('✅ Fallback build completed successfully');
  } catch (fallbackError) {
    console.error('❌ All build methods failed');
    process.exit(1);
  }
}