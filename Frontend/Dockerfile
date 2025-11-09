FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./


RUN rm -f package-lock.json

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build app
RUN npm run build



# Serve with Nginx
FROM nginx:alpine

# Remove default config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]