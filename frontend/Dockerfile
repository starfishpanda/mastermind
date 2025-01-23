# frontend/Dockerfile

# ------------ 1) BUILD STAGE ------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy the rest of the frontend code
COPY . .
ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV
# Build production artifacts (the final React build in /dist)
RUN npm run build

# ------------ 2) RUNTIME STAGE ------------
FROM nginx:alpine

# Set working directory to the default nginx html location
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built artifacts from builder stage to Nginx's default directory
COPY --from=build /app/dist ./

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
