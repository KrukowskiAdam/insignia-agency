#!/bin/bash
set -e

echo "Starting Strapi application..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm ci
fi

# Build the application if build folder doesn't exist
if [ ! -d "build" ]; then
    echo "Building application..."
    npm run build
fi

# Start the application
echo "Starting Strapi..."
exec npm start