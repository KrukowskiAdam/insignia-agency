# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install ALL dependencies (including dev deps needed for build)
RUN npm ci

# Copy application code
COPY backend/ ./

# Copy pre-built admin panel (built locally)
COPY backend/dist/build ./build

# Remove dev dependencies - we have pre-built admin panel
RUN npm prune --production

# Expose port
EXPOSE $PORT

# Start directly - no build needed
CMD ["npm", "start"]