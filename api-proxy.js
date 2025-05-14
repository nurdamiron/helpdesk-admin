const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Get local IP
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIP = '127.0.0.1';

// Find a non-internal IPv4 address
Object.keys(networkInterfaces).forEach((ifname) => {
  networkInterfaces[ifname].forEach((iface) => {
    if (!iface.internal && iface.family === 'IPv4') {
      localIP = iface.address;
    }
  });
});

// Backend API URL
const apiUrl = 'http://localhost:5002';
console.log(`Proxying requests to backend at: ${apiUrl}`);

// Enable CORS for all routes
app.use(cors());

// API proxy for /api requests
app.use('/api', createProxyMiddleware({ 
  target: apiUrl,
  changeOrigin: true,
  pathRewrite: {'^/api': '/api'},
  onProxyRes: (proxyRes, req, res) => {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  }
}));

// WS proxy for /ws requests
app.use('/ws', createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true,
  ws: true,
  pathRewrite: {'^/ws': '/ws'}
}));

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Modify index.html to include proper backend URLs
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Add runtime configuration for backend URLs
  const configScript = `
  <script>
    window.REACT_APP_API_URL = "http://${localIP}:${PORT}/api";
    window.REACT_APP_WS_URL = "ws://${localIP}:${PORT}/ws";
    console.log("Mobile proxy config loaded: API URL =", window.REACT_APP_API_URL);
  </script>
  `;
  
  // Insert the config script after the opening head tag
  indexHtml = indexHtml.replace('<head>', '<head>' + configScript);
  
  res.send(indexHtml);
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Mobile proxy server running at http://${HOST}:${PORT}/`);
  console.log(`Access on your phone at: http://${localIP}:${PORT}/`);
  console.log(`API requests will be proxied to: ${apiUrl}/api`);
  console.log(`WebSocket connections will be proxied to: ${apiUrl}/ws`);
});