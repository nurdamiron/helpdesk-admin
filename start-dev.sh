#!/bin/bash
export SKIP_PREFLIGHT_CHECK=true
export DISABLE_ESLINT_PLUGIN=true
export NODE_OPTIONS="--openssl-legacy-provider"

echo "Starting development server with CRACO..."
npx craco start
