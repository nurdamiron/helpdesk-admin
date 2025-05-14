const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Enable CORS for all routes
app.use(cors());

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Modify index.html to include proper backend URLs
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  
  // Add runtime configuration for backend URLs
  const configScript = `
  <script>
    window.REACT_APP_API_URL = "http://192.168.101.9:5002/api";
    window.REACT_APP_WS_URL = "ws://192.168.101.9:5002/ws";
    console.log("Mobile config loaded: API URL =", window.REACT_APP_API_URL);
  </script>
  `;
  
  // Insert the config script after the opening head tag
  indexHtml = indexHtml.replace('<head>', '<head>' + configScript);
  
  res.send(indexHtml);
});

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log(`Access on your mobile device at http://192.168.101.9:${PORT}/`);
});