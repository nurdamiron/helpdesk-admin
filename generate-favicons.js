const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// This is a simple script to generate a favicon.ico file
// It creates a blue square with "HD" text as a simplified version of your logo
// Install the dependencies with: npm install canvas

const sizes = [16, 32, 48, 64, 128, 256];
const primaryColor = '#1976d2'; // Your app's primary color

// Create the output directory if it doesn't exist
const faviconDir = path.join(__dirname, 'public', 'favicons');
if (!fs.existsSync(faviconDir)) {
  fs.mkdirSync(faviconDir, { recursive: true });
}

// Generate favicons for each size
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Blue background
  ctx.fillStyle = primaryColor;
  ctx.fillRect(0, 0, size, size);

  // White text "HD" (HelpDesk)
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HD', size * 0.5, size * 0.5);

  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(faviconDir, `favicon-${size}x${size}.png`), buffer);
  console.log(`Generated favicon-${size}x${size}.png`);
});

console.log('Favicon generation complete!');