# --- ETAPA DE BUILD ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# pnpm
RUN corepack enable

# deps (cacheables)
COPY pnpm-lock.yaml package.json ./
COPY pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# codigo necesario
COPY apps/auth-service ./apps/auth-service
COPY libs ./libs
COPY nest-cli.json tsconfig.json ./

# prisma generate usando el schema real
RUN pnpm prisma generate --schema=apps/auth-service/prisma/schema.prisma

# build del microservicio
RUN pnpm exec nest build auth-service

# protos al dist
RUN mkdir -p dist/apps/auth-service/proto \
  && cp libs/common/proto/*.proto dist/apps/auth-service/proto/

# --- ETAPA DE RUN ---
FROM node:20-alpine
WORKDIR /usr/src/app

RUN corepack enable

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/apps/auth-service/prisma ./apps/auth-service/prisma

EXPOSE 50051

# no migrations => db push
CMD sh -c "pnpm prisma db push --schema=apps/auth-service/prisma/schema.prisma && node dist/apps/auth-service/main"
