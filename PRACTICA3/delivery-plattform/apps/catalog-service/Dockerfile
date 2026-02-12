# --- ETAPA DE BUILD ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

RUN corepack enable

# deps (cacheables)
COPY pnpm-lock.yaml package.json ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# codigo necesario
COPY apps/catalog-service ./apps/catalog-service
COPY libs ./libs
COPY nest-cli.json tsconfig.json ./

# prisma generate
RUN pnpm prisma generate --schema=apps/catalog-service/prisma/schema.prisma

# build del microservicio
RUN pnpm exec nest build catalog-service

# protos al dist
RUN mkdir -p dist/apps/catalog-service/proto \
    && cp libs/common/proto/*.proto dist/apps/catalog-service/proto/

# --- ETAPA DE RUN ---
FROM node:20-alpine
WORKDIR /usr/src/app

RUN corepack enable

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/apps/catalog-service/prisma ./apps/catalog-service/prisma

EXPOSE 50052

CMD sh -c "pnpm prisma db push --schema=apps/catalog-service/prisma/schema.prisma && node dist/apps/catalog-service/main"
