import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';

import { HyperRpcExceptionFilter } from './common/rpc-exception.filter';
import { GrpcToHttpInterceptor } from './common/grpc-to-http.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api-gateway');

  app.useGlobalInterceptors(new GrpcToHttpInterceptor());
  app.useGlobalFilters(new HyperRpcExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
