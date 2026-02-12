import { Module } from '@nestjs/common';
import { OrdersServiceService } from './orders-service.service';
import { HealthController } from './health/health.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaController } from './prisma/prisma.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { existsSync } from 'fs';
import * as path from 'path';
import { OrdersGrpcController } from './orders.grpc.controller';
import { CreateOrderUseCase } from './usecases/create-order.usecase';
import { CatalogGrpcService } from './catalog/catalogo.grpc';
import { OrdersRepository } from './repo/orders.repo';
import { ConfigModule } from '@nestjs/config';
import { EnvConfig } from '../config/app.config';
import { JoiValidationSchema } from '../config/joi.vaidation';

function resolveCatalogProto(): string {
  const distProto = path.join(
    process.cwd(),
    'dist/apps/orders-service/proto/catalog.proto',
  );
  if (existsSync(distProto)) return distProto;

  return path.join(process.cwd(), 'libs/common/proto/catalog.proto');
}

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
      envFilePath: ['apps/orders-service/.env', '.env'],
      validationSchema: JoiValidationSchema,
    }),
    ClientsModule.register([
      {
        name: 'CATALOG_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'catalog',
          protoPath: resolveCatalogProto(),
          url: process.env.CATALOG_SERVICE_GRPC_URL ?? 'localhost:50052',
          loader: { keepCase: true },
        },
      },
    ]),
  ],
  controllers: [OrdersGrpcController, HealthController, PrismaController],
  providers: [
    OrdersServiceService,
    PrismaService,
    CreateOrderUseCase,
    CatalogGrpcService,
    OrdersRepository,
  ],
})
export class OrdersServiceModule {}
