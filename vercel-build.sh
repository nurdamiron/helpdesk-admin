#!/bin/bash
set -e

echo "Starting custom build script for Vercel..."

# Step 1: Apply our comprehensive fixes
node pre-build.js

# Step 2: Verify patches were created
echo "Verifying patches were created..."
if [ ! -f "schema-utils-fix.js" ]; then
  echo "Error: schema-utils-fix.js not found!"
  exit 1
fi

if [ ! -f "terser-webpack-plugin-fix.js" ]; then
  echo "Error: terser-webpack-plugin-fix.js not found!"
  exit 1
fi

# Step 3: Apply JavaScript patches
echo "Applying JavaScript patches..."
if [ -f "monkey-patch.js" ]; then
  node monkey-patch.js
fi

# Step 4: Run the build using craco instead of react-scripts
echo "Running build with craco..."
SKIP_PREFLIGHT_CHECK=true CI=false REACT_APP_ENV=production node_modules/.bin/craco build

echo "Build completed successfully!"