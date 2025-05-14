#!/bin/bash

# First patch the React scripts directly
echo "Patching React scripts..."
node patch-react-scripts.js

# Then run the app with React scripts (no CRACO)
echo "Starting development server with React Scripts..."
export SKIP_PREFLIGHT_CHECK=true
export DISABLE_ESLINT_PLUGIN=true
export NODE_OPTIONS="--openssl-legacy-provider"

npx react-scripts start