const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Vite build...');

// Create vite.config.js
const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
    assetsDir: 'static',
    sourcemap: false,
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        assetFileNames: 'static/[ext]/[name].[hash].[ext]',
        chunkFileNames: 'static/js/[name].[hash].js',
        entryFileNames: 'static/js/[name].[hash].js'
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.REACT_APP_API_URL': '"https://helpdesk-backend-ycoo.onrender.com/api"',
    'process.env.REACT_APP_WS_URL': '"wss://helpdesk-backend-ycoo.onrender.com/ws"',
    'process.env.REACT_APP_ENV': '"production"'
  }
})
`;

fs.writeFileSync(path.join(__dirname, 'vite.config.js'), viteConfig);

// Create index.html for Vite
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Helpdesk Admin Panel" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Helpdesk Admin</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), indexHtml);

// Rename all .js files containing JSX to .jsx
console.log('🔄 Converting .js files with JSX to .jsx...');

function findAndRenameJsxFiles(dir) {
  let renamedCount = 0;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      renamedCount += findAndRenameJsxFiles(fullPath);
    } else if (file.endsWith('.js') && !file.includes('.min.')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('<') && (content.includes('React') || content.includes('jsx') || content.includes('Component'))) {
          const newPath = fullPath.replace('.js', '.jsx');
          fs.renameSync(fullPath, newPath);
          console.log(`📝 Renamed ${fullPath} to ${newPath}`);
          renamedCount++;
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }
  });
  
  return renamedCount;
}

try {
  const srcDir = path.join(__dirname, 'src');
  const renamedCount = findAndRenameJsxFiles(srcDir);
  console.log(`✅ Converted ${renamedCount} files to .jsx`);
  
  // Update HTML to point to .jsx
  const updatedHtml = indexHtml.replace('/src/index.js', '/src/index.jsx');
  fs.writeFileSync(path.join(__dirname, 'index.html'), updatedHtml);
  
  // Fix imports in all .jsx files
  console.log('🔧 Updating imports in .jsx files...');
  function updateImports(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        updateImports(fullPath);
      } else if (file.endsWith('.jsx')) {
        try {
          let content = fs.readFileSync(fullPath, 'utf8');
          // Update relative imports from .js to .jsx
          content = content.replace(/from\s+['"`]([^'"`]+)\.js['"`]/g, "from '$1.jsx'");
          content = content.replace(/import\s+['"`]([^'"`]+)\.js['"`]/g, "import '$1.jsx'");
          fs.writeFileSync(fullPath, content);
        } catch (e) {
          // Skip files that can't be processed
        }
      }
    });
  }
  
  updateImports(srcDir);
  console.log('✅ Updated imports in JSX files');
} catch (error) {
  console.log('⚠️ Could not auto-convert files:', error.message);
}

console.log('📦 Installing Vite...');

try {
  // Install Vite and React plugin
  execSync('npm install --no-save vite @vitejs/plugin-react', { stdio: 'inherit' });
  
  console.log('🔨 Building with Vite...');
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  });
  
  // Copy remaining public files
  console.log('📁 Copying public assets...');
  if (fs.existsSync('./public')) {
    const publicFiles = fs.readdirSync('./public');
    publicFiles.forEach(file => {
      if (file !== 'index.html') {
        try {
          execSync(`cp -r ./public/${file} ./build/`, { stdio: 'pipe' });
        } catch (e) {
          // Ignore copy errors for non-critical files
        }
      }
    });
  }
  
  console.log('✅ Vite build completed successfully!');
} catch (error) {
  console.error('❌ Vite build failed, trying final webpack approach...');
  
  // One more try with a super minimal webpack setup
  try {
    console.log('🔄 Trying minimal webpack without any validation...');
    
    const minimalWebpack = `
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'static/js/bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\\.(js|jsx)$/,
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
      }
    ]
  },
  // No optimization to avoid any validation issues
  optimization: false
};
`;
    
    fs.writeFileSync(path.join(__dirname, 'webpack.minimal.js'), minimalWebpack);
    
    // Install webpack-cli
    execSync('npm install --no-save webpack-cli', { stdio: 'inherit' });
    
    // Create minimal HTML
    const minimalHtml = `<!DOCTYPE html>
<html><head><title>Helpdesk</title></head><body><div id="root"></div><script src="/static/js/bundle.js"></script></body></html>`;
    
    if (!fs.existsSync('./build')) {
      fs.mkdirSync('./build');
    }
    if (!fs.existsSync('./build/static')) {
      fs.mkdirSync('./build/static');
    }
    if (!fs.existsSync('./build/static/js')) {
      fs.mkdirSync('./build/static/js');
    }
    
    fs.writeFileSync('./build/index.html', minimalHtml);
    
    execSync('npx webpack --config webpack.minimal.js', { stdio: 'inherit' });
    console.log('✅ Minimal webpack build completed!');
    
  } catch (finalError) {
    console.error('❌ All build methods failed');
    process.exit(1);
  }
}