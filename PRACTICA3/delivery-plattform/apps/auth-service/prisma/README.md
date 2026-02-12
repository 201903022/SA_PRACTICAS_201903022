# Configuracion de Prisma

## Instalar prisma

```bash
pnpm add prisma @prisma/client
```

## Inicializar Prisma

```bash
pnpm exec prisma db pull --schema=prisma/schema.prisma
```

## Generar schemas Prisma

```bash
pnpm exec prisma generate --schema=apps/auth-service/prisma/schema.prisma
```