import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(
          process.cwd(),
          'dist/apps/auth-service/proto/auth.proto',
        ),
        url: '0.0.0.0:50051',
      },
    },
  );

  await app.listen();
}
bootstrap();
