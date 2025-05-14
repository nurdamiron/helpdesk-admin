#!/bin/bash

# Install required dependencies if they don't exist
if ! npm list express cors http-proxy-middleware > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install express cors http-proxy-middleware --no-save
fi

# Build static files if they don't exist yet
if [ ! -f ./build/index.html ]; then
  echo "Building static files..."
  node deep-patch.js
fi

# Start the proxy server
echo "Starting proxy server for mobile access..."
echo "This server will proxy API requests to your local backend at localhost:5002"
node api-proxy.js