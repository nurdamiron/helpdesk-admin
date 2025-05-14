#!/bin/bash
set -e

echo "Starting custom build script for Vercel..."

# Step 1: Apply fixes to package.json
node pre-build.js

# Step 2: Apply JavaScript patches (more reliable than sed)
echo "Applying JavaScript patches..."
node monkey-patch.js

# Step 3: Run the actual build
echo "Running React build..."
SKIP_PREFLIGHT_CHECK=true CI=false REACT_APP_ENV=production react-scripts build

echo "Build completed successfully!"