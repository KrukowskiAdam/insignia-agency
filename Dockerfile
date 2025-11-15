# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY backend/ ./

# Build the application
RUN npm run build

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]