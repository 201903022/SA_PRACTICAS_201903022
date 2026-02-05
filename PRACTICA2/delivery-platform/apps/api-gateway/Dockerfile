FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# 1. Instalar dependencias (se mantiene en caché si el package.json no cambia)
COPY package*.json ./
RUN npm install

# 2. COPIA SELECTIVA: Solo lo que el Gateway necesita
# Copiamos la carpeta de la app, las librerías compartidas y la config de Nest
COPY apps/api-gateway ./apps/api-gateway
COPY libs ./libs
COPY nest-cli.json tsconfig.json ./
COPY package*.json ./ 

# 3. Construir la app usando Nest CLI directamente
RUN npx nest build api-gateway

# 4. Preparar los protos (el Gateway los necesita para hablar con Auth)
RUN mkdir -p dist/apps/api-gateway/proto && cp libs/common/proto/*.proto dist/apps/api-gateway/proto/

# --- ETAPA DE PRODUCCIÓN ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Copiar solo lo necesario de la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Recreamos la estructura para el .env (CWD support)
RUN mkdir -p apps/api-gateway
COPY apps/api-gateway/.env ./apps/api-gateway/.env

EXPOSE 3000

# Arrancamos el Gateway
CMD ["node", "dist/apps/api-gateway/main"]