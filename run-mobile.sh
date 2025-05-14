#!/bin/bash

# Get local IP address (Mac OS)
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')

echo "Local IP address: $IP"

# Update the mobile server with the correct IP
sed -i '' "s/192\.168\.101\.9/$IP/g" ./mobile-server.js
sed -i '' "s/192\.168\.101\.9/$IP/g" ./.env.mobile

echo "Updated mobile server and environment files with IP: $IP"

# Check if express and cors are installed
if ! npm list express cors > /dev/null 2>&1; then
  echo "Installing required dependencies..."
  npm install express cors --no-save
fi

# Build static files if they don't exist yet
if [ ! -f ./build/index.html ]; then
  echo "Building static files..."
  node deep-patch.js
fi

# Start the mobile server
echo "Starting mobile server on all interfaces..."
echo "Access on your mobile device at http://$IP:3000/"
node mobile-server.js