import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const protoPath =
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '../proto/auth.proto') // En producción usa dist
      : join(process.cwd(), 'libs/common/proto/auth.proto'); // En desarrollo usa la carpeta real

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        // Subimos un nivel desde 'src' para encontrar la carpeta 'proto' en dist
        protoPath: protoPath,
        url: '127.0.0.1:50051',
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();
  console.log('Auth Microservice is running on port 50051');
}
bootstrap();
