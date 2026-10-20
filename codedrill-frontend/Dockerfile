# Multi-stage Dockerfile for CodeDrill Frontend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package definition and install dependencies
COPY package.json ./
RUN npm install

# Copy source code and build production bundle
COPY tsconfig.json vite.config.ts index.html ./
COPY src ./src
RUN npm run build

# Nginx Alpine runtime stage
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
