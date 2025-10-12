# --- build
FROM node:20-alpine AS build
WORKDIR /app

# ускоряем npm и отключаем аудит
RUN npm config set fund false && npm config set audit false

COPY package*.json ./
# игнорируем peer deps, чтобы обойти ERESOLVE
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# --- run
FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# если НЕ standalone:
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# если используете output: "standalone", то лучше так:
# COPY --from=build /app/.next/standalone ./
# COPY --from=build /app/.next/static ./.next/static
# COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["npm","run","start"]
