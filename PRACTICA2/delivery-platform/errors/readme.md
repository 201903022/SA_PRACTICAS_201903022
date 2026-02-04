# Errores en nestjs 

## Prisma

```bash
PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions
```

### Explicacion

En tu setup (NestJS + monorepo + Prisma 7.x), new PrismaClient() sin opciones no lograba inicializar el motor de Prisma (engine) correctamente y Prisma exigia construir el cliente con opciones validas. En Prisma 7, una forma compatible y recomendada es usar un Driver Adapter para Postgres.

### Solucion

se error ya no es de Nest: es de Prisma 7.x. En Prisma 7, en muchos setups (Nest/webpack/monorepo) new PrismaClient() sin opciones revienta y te obliga a construir el cliente con Driver Adapter (o con Accelerate).

Se instalo el adaptador de PostgreSQL y se construyo Prisma con adapter:

Dependencias: @prisma/adapter-pg y pg

Cambio en PrismaService: super({ adapter }) usando DATABASE_URL

```bash
pnpm add @prisma/adapter-pg pg

pnpm add -D @types/pg
```

### Estructura de ``./prisma/prisma.service.ts``

```ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;

    if (!url) {
      throw new Error(
        'DATABASE_URL no esta definida. Revisa ConfigModule.forRoot(envFilePath) y tu .env.',
      );
    }

    const adapter = new PrismaPg({ connectionString: url });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```
