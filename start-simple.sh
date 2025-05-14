#!/bin/bash
echo "Starting simple development server..."

# Check if express is installed
if ! npm list express > /dev/null 2>&1; then
  echo "Installing express..."
  npm install express --no-save
fi

# Start the server
node simple-server.js
