# Multi-stage Dockerfile for CodeDrill Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root workspace and package manifests
COPY package.json ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production runtime stage
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install dumb-init for proper PID 1 signal forwarding
RUN apk add --no-cache dumb-init

COPY package.json ./
RUN npm install --omit=dev

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Use unprivileged node user
USER node

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
