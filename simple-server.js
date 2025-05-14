
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
