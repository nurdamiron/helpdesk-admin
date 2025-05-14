const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// This script generates favicon files from the logo.png
// Install the dependencies with: npm install canvas

const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];
const logoPath = path.join(__dirname, 'public', 'images', 'logo.png');

// Create the output directory if it doesn't exist
const faviconDir = path.join(__dirname, 'public', 'favicons');
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true });
}

async function generateFavicons() {
  try {
    const logo = await loadImage(logoPath);
    
    // Generate favicons for each size
    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      
      // Draw logo with proper scaling
      ctx.drawImage(logo, 0, 0, size, size);
      
      // Save as PNG
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(path.join(faviconDir, `favicon-${size}x${size}.png`), buffer);
      console.log(`Generated favicon-${size}x${size}.png`);
      
      // Create the main sizes needed for favicon.ico and PWA icons
      if (size === 192) {
        fs.writeFileSync(path.join(__dirname, 'public', 'logo192.png'), buffer);
        console.log('Updated logo192.png');
      }
      else if (size === 512) {
        fs.writeFileSync(path.join(__dirname, 'public', 'logo512.png'), buffer);
        console.log('Updated logo512.png');
      }
    }
    
    // Create favicon.ico (commonly 16x16, 32x32, 48x48)
    // This requires additional libraries to create .ico files, so we'll use PNG for now
    // For production, you might want to use a favicon generator service or library that supports .ico
    console.log('Copying 32x32 as favicon.ico placeholder (for production, use a proper .ico generator)');
    const favicon32Buffer = fs.readFileSync(path.join(faviconDir, 'favicon-32x32.png'));
    fs.writeFileSync(path.join(__dirname, 'public', 'favicon.ico'), favicon32Buffer);
    
    // Create SVG favicon
    // Simple SVG wrapper for the logo
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <image href="data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}" width="100" height="100"/>
    </svg>`;
    fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), svgContent);
    console.log('Created favicon.svg');
    
    console.log('Favicon generation complete!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();