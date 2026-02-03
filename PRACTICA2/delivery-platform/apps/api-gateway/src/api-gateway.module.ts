import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), 'libs/common/proto/auth.proto'),
          url: 'localhost:50051',
          loader: {
            keepCase: true,
          },
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController, AuthController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
