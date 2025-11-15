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

# Don't build during Docker build - Railway env vars not available yet
# Keep dev dependencies for runtime build

# Expose port
EXPOSE $PORT

# Build at runtime when env vars are available, then start
CMD ["sh", "-c", "echo 'Building Strapi with runtime env vars...' && npm run build && echo 'Starting Strapi...' && npm start"]