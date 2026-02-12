import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthController } from './auth/auth.controller';
import { ApiGatewayService } from './api-gateway.service';
import { join } from 'path';
import { existsSync } from 'fs';
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.vaidation';
import { AdminController } from './admin/admin.controller';
import { CatalogController } from './catalog/catalog.controller';
import { CatalogGrpcService } from './catalog/catalog.grpc';
import { MerchantGuard } from './guards/MerchantOperation.guard';
import { OrdersController } from './orders/orders.controller';
import { OrdersGrpsService } from './orders/orders.grpc';
import { UserGuard } from './guards/UserOperation.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
      envFilePath: ['apps/api-gateway/.env', '.env'],
      validationSchema: JoiValidationSchema,
    }),
    ClientsModule.registerAsync([
      // ? ===================== AUTH =====================
      {
        name: 'AUTH_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const dockerProtoPath = join(
            process.cwd(),
            'dist/apps/api-gateway/proto/auth.proto',
          );

          const dockerProtoPathAlt = join(__dirname, 'proto/auth.proto');

          const devProtoPath = join(
            process.cwd(),
            'libs/common/proto/auth.proto',
          );

          const finalProtoPath = existsSync(dockerProtoPath)
            ? dockerProtoPath
            : existsSync(dockerProtoPathAlt)
              ? dockerProtoPathAlt
              : devProtoPath;

          console.log(`[API-GATEWAY] AUTH proto: ${finalProtoPath}`);

          return {
            transport: Transport.GRPC,
            options: {
              package: 'auth',
              protoPath: finalProtoPath,
              url: configService.get<string>(
                'AUTH_SERVICE_GRPC_URL',
                'localhost:50052',
              ),
              loader: { keepCase: true },
            },
          };
        },
      },

      // ? ===================== CATALOG =====================
      {
        name: 'CATALOG_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const dockerProtoPath = join(
            process.cwd(),
            'dist/apps/api-gateway/proto/catalog.proto',
          );

          const dockerProtoPathAlt = join(__dirname, 'proto/catalog.proto');

          const devProtoPath = join(
            process.cwd(),
            'libs/common/proto/catalog.proto',
          );

          const finalProtoPath = existsSync(dockerProtoPath)
            ? dockerProtoPath
            : existsSync(dockerProtoPathAlt)
              ? dockerProtoPathAlt
              : devProtoPath;

          console.log(`[API-GATEWAY] CATALOG proto: ${finalProtoPath}`);

          return {
            transport: Transport.GRPC,
            options: {
              package: 'catalog',
              protoPath: finalProtoPath,
              url: configService.get<string>(
                'CATALOG_SERVICE_GRPC_URL',
                'localhost:50052',
              ),
              loader: { keepCase: true },
            },
          };
        },
      },

      // ? ===================== ORDERS =====================
      {
        name: 'ORDERS_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const dockerProtoPath = join(
            process.cwd(),
            'dist/apps/api-gateway/proto/orders.proto',
          );

          const dockerProtoPathAlt = join(__dirname, 'proto/orders.proto');

          const devProtoPath = join(
            process.cwd(),
            'libs/common/proto/orders.proto',
          );

          const finalProtoPath = existsSync(dockerProtoPath)
            ? dockerProtoPath
            : existsSync(dockerProtoPathAlt)
              ? dockerProtoPathAlt
              : devProtoPath;

          console.log(`[API-GATEWAY] ORDERS proto: ${finalProtoPath}`);

          return {
            transport: Transport.GRPC,
            options: {
              package: 'orders', // <- package orders; en orders.proto
              protoPath: finalProtoPath,
              url: configService.get<string>(
                'ORDERS_SERVICE_GRPC_URL',
                'localhost:50054', // <- por defecto orders
              ),
              loader: { keepCase: true },
            },
          };
        },
      },
    ]),
  ],
  controllers: [
    ApiGatewayController,
    AuthController,
    AdminController,
    // ? nuevo
    CatalogController,
    OrdersController,
  ],
  providers: [
    ApiGatewayService,
    // ? nuevo
    CatalogGrpcService,
    MerchantGuard,
    OrdersGrpsService,
    UserGuard,
  ],
})
export class ApiGatewayModule {}
