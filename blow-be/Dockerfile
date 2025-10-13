# --- build stage
FROM node:20-bullseye AS build
WORKDIR /app

RUN npm config set fund false && npm config set audit false

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# --- production stage
FROM node:20-bullseye AS production
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=build /app/dist ./dist
COPY --from=build /app/template ./template
COPY --from=build /app/uploads ./uploads
COPY --from=build /app/scripts ./scripts

# Pre-create uploads directory and mark as volume for persistence
RUN mkdir -p /app/uploads
VOLUME ["/app/uploads"]

EXPOSE 4000
CMD ["npm", "run", "start:prod"]
