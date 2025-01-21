# backend/Dockerfile

# ------------ 1) BUILD STAGE ------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code (if applicable)
RUN npm run build

# ------------ 2) RUNTIME STAGE ------------
FROM node:20-alpine 

WORKDIR /app

# Copy the built files from builder
COPY --from=builder /app/dist ./dist

# Copy package.json files again so we can install only production deps
COPY package*.json ./
# Install only productions dependencies
RUN npm ci --omit=dev

# Expose the backend port (e.g., 3000) it listens on
EXPOSE 3000

# Start the backend server
CMD ["node", "dist/index.js"]
