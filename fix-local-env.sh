#!/bin/bash
set -e

echo "Fixing local development environment..."

# Apply package.json fixes first
node pre-build.js

# Apply direct patches to node_modules
node patch-dependencies.js

# Set environment variables in .env.local
echo "Creating .env.local with needed settings..."
cat > .env.local << 'EOF'
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
EOF

echo "Local environment setup complete. Try running 'npm run dev' now."