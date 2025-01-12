# backend/Dockerfile

FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Install TypeScript globally if needed
RUN npm install -g typescript

# Copy production env file
COPY .env.production .env

# Build the TypeScript code (if applicable)
RUN npm run build

# Expose the backend port (e.g., 3000)
EXPOSE 3000

# Start the backend server
CMD ["node", "dist/index.js"]
