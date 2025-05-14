const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Starting static build process...');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create images directory if it doesn't exist
const imagesDir = path.join(buildDir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Ensure logo exists in images directory
const logoSrc = path.join(__dirname, 'public', 'images', 'logo.png');
const logoDest = path.join(imagesDir, 'logo.png');
fs.copyFileSync(logoSrc, logoDest);

// Copy public directory to build
console.log('Copying public directory to build...');
exec('cp -r ./public/manifest.json ./build/ || true', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error copying public directory: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log('Public directory copied successfully');
  
  // Create a simple static build with the logo
  createStaticBuild();
});

function createStaticBuild() {
  console.log('Creating static index.html...');
  
  // Create an index.html file that loads the logo
  const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="./images/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1976d2" />
    <meta
      name="description"
      content="HelpDesk Admin Panel - Құрылыс Көмегі"
    />
    <link rel="apple-touch-icon" href="./images/logo.png" />
    <title>HelpDesk Admin</title>
    <style>
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #f5f5f5;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        text-align: center;
      }
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      img {
        max-width: 200px;
        margin-bottom: 2rem;
      }
      h1 {
        color: #1976d2;
        margin-bottom: 1rem;
      }
      p {
        color: #666;
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      .message {
        margin-top: 2rem;
        color: #1976d2;
        font-weight: bold;
      }
      .contact {
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <img src="./images/logo.png" alt="Logo">
      <h1>HelpDesk Admin</h1>
      <p>Welcome to the HelpDesk Admin Portal. This system is designed to manage support tickets and customer inquiries efficiently.</p>
      <div class="message">The application is currently being updated.</div>
      <div class="contact">Please contact the system administrator for more information.</div>
    </div>
  </body>
</html>
  `;
  
  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  console.log('Static build completed successfully!');
}