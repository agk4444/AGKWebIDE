# Multi-stage Docker build for AGK Web IDE
# Stage 1: WASM Build Environment
FROM rust:1.75-slim AS wasm-builder

# Install wasm-pack
RUN cargo install wasm-pack

# Set working directory
WORKDIR /app

# Copy WASM project files
COPY wasm-file-manager/ ./wasm-file-manager/

# Build WASM module
WORKDIR /app/wasm-file-manager
RUN wasm-pack build --target web --out-dir pkg

# Stage 2: Node.js Build Environment
FROM node:18-alpine AS node-builder

# Install system dependencies
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Copy built WASM files from wasm-builder stage
COPY --from=wasm-builder /app/wasm-file-manager/pkg ./public/

# Build the application
RUN npm run build

# Stage 3: Production Nginx Server
FROM nginx:alpine AS production

# Copy custom nginx configuration
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

# Copy built application from node-builder stage
COPY --from=node-builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Switch to non-root user
USER nextjs

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]