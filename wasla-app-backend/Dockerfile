# Étape build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
ARG NPM_FLAGS=--legacy-peer-deps
RUN npm install $NPM_FLAGS
COPY . .
RUN npm run build

# Étape prod
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
ARG NPM_FLAGS=--legacy-peer-deps
RUN npm install $NPM_FLAGS

EXPOSE 3001
CMD ["node", "dist/main"]
