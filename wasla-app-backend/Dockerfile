# -------------------
# Étape build
# -------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Copier seulement les fichiers de dépendances
COPY package*.json ./

# Installer toutes les dépendances (avec legacy-peer-deps si besoin)
ARG NPM_FLAGS=--legacy-peer-deps
RUN npm install $NPM_FLAGS

# Copier le reste des fichiers et build le projet
COPY . .
RUN npm run build

# -------------------
# Étape production
# -------------------
FROM node:20-alpine
WORKDIR /app

# Copier seulement les fichiers nécessaires
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001

# Commande pour démarrer le serveur Nest
CMD ["node", "dist/main.js"]
