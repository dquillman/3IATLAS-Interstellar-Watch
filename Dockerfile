# Multi-stage build for efficient deployment

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Backend server with frontend static files
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy backend server
COPY server.js ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist

# Expose port (Cloud Run will set PORT env var)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
