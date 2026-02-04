import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { existsSync } from 'fs';
import { AuthServiceModule } from './auth-service.module';

function resolveProtoPath() {
  // 1) si existe el proto en dist (produccion / build), usa __dirname
  const distProto = join(__dirname, '../proto/auth.proto');
  if (existsSync(distProto)) return distProto;

  // 2) si no, usa el del repo (dev)
  const devProto = join(process.cwd(), 'libs/common/proto/auth.proto');
  return devProto;
}

async function bootstrap() {
  const protoPath = resolveProtoPath();

  // gRPC URL desde env (validado por Joi en ConfigModule)
  // fallback: 0.0.0.0 para que acepte conexiones externas (si lo necesitas)
  const grpcUrl = process.env.AUTH_SERVICE_GRPC_URL ?? '0.0.0.0:50051';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath,
        url: grpcUrl,
        loader: {
          keepCase: true,
        },
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        console.log('--- ERROR DE VALIDACION EN AUTH MS ---');
        console.log(JSON.stringify(errors, null, 2));

        return new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: 'Validation failed',
          // opcional: mandar detalle sin exponer demasiado
          // details: errors
        });
      },
    }),
  );

  app.enableShutdownHooks();
  await app.listen();

  console.log(`Auth Microservice is running on ${grpcUrl}`);
}

bootstrap();
