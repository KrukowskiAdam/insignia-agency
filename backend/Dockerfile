# Payload CMS + Next.js 15 Dockerfile for Railway
# Optimized for Alpine Linux with proper sharp support

FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat vips-dev
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with sharp support
RUN npm ci --include=optional


# Build stage
FROM base AS builder
RUN apk add --no-cache libc6-compat vips-dev build-base python3 g++ make
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Reinstall sharp with correct Alpine Linux binaries
RUN npm install --cpu=x64 --os=linux --libc=musl sharp@0.34.2

# Build application
RUN npm run build

# Production stage
FROM base AS runner
RUN apk add --no-cache vips
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create and set permissions for next cache
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
