import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { OrdersServiceModule } from './orders-service.module';
import { existsSync } from 'fs';
import { Logger } from '@nestjs/common';
function resolveProtoPath() {
  // 1. Ruta para Producción (dentro de dist)
  // __dirname es /usr/src/app/dist/apps/orders-service
  const distProto = join(__dirname, 'proto/orders.proto');
  if (existsSync(distProto)) return distProto;

  // 2. Ruta para Docker (basada en la copia manual que hicimos al root del dist)
  const dockerProto = join(process.cwd(), 'proto/orders.proto');
  if (existsSync(dockerProto)) return dockerProto;

  // 3. Ruta para Desarrollo Local
  const devProto = join(process.cwd(), 'libs/common/proto/orders.proto');
  return devProto;
}
async function bootstrap() {
  const orderUrl = process.env.ORDERS_SERVICE_URL ?? '0.0.0.0:50054';
  const logger = new Logger('Bootstrap');
  logger.log(`Orders Service gRPC running on: ${orderUrl}`);
  console.log(`Order Service gPRC running on ${orderUrl}`);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'orders',
        protoPath: resolveProtoPath(),
        url: orderUrl,
        loader: {
          keepCase: true,
        },
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();
  console.log(`Orders Service is listening...`);
}
bootstrap();
