import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { existsSync } from 'fs';
import { CatalogServiceModule } from './catalog-service.module';

function resolveProtoPath() {
  const distProto = join(__dirname, 'proto/catalog.proto');
  if (existsSync(distProto)) return distProto;

  const dockerProto = join(process.cwd(), 'proto/catalog.proto');
  if (existsSync(dockerProto)) return dockerProto;

  return join(process.cwd(), 'libs/common/proto/catalog.proto');
}

async function bootstrap() {
  const protoPath = resolveProtoPath();
  const grpcUrl = process.env.CATALOG_SERVICE_GRPC_URL ?? '0.0.0.0:50052';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'catalog',
        protoPath,
        url: grpcUrl,
        loader: { keepCase: true },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log('--- ERROR DE VALIDACION EN CATALOG MS ---');
        console.log(JSON.stringify(errors, null, 2));
        return new RpcException({ code: 3, message: 'Validation failed' });
      },
    }),
  );

  await app.listen();
  console.log(`Catalog Microservice is running on ${grpcUrl}`);
}

bootstrap();
