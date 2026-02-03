import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const protoPath =
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '../proto/auth.proto')
      : join(process.cwd(), 'libs/common/proto/auth.proto');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: protoPath,
        url: '127.0.0.1:50051',
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
        console.log('--- ERROR DE VALIDACIÓN EN AUTH MS ---');
        console.log(JSON.stringify(errors, null, 2));

        return new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: 'Validation failed',
        });
      },
    }),
  );
  app.enableShutdownHooks();

  await app.listen();
  console.log('Auth Microservice is running on port 50051');
}
bootstrap();
