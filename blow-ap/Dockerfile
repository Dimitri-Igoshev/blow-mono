# --- build stage
FROM node:24-alpine AS build
WORKDIR /app

RUN npm config set fund false && npm config set audit false

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# --- production stage
FROM nginx:1.27-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
