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

# Copy production environment file
COPY backend/.env.production .env

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE $PORT

# Debug environment variables
RUN echo "Node version:" && node --version
RUN echo "NPM version:" && npm --version

# Start the application with debug
CMD ["sh", "-c", "echo 'Environment check:' && echo 'NODE_ENV:' $NODE_ENV && echo 'DATABASE_URL exists:' && test -n '$DATABASE_URL' && echo 'Yes' || echo 'No' && npm start"]