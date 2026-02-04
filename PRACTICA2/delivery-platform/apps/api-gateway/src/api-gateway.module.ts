import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Importa esto
import { ApiGatewayController } from './api-gateway.controller';
import { AuthController } from './auth/auth.controller';
import { ApiGatewayService } from './api-gateway.service';
import { join } from 'path';
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.vaidation';

@Module({
  imports: [
    // * ConfigModule para usar variables de entorno
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
      envFilePath: ['apps/api-gateway/.env', '.env'],
      validationSchema: JoiValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true, // permite variables extra
      },
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: join(process.cwd(), 'libs/common/proto/auth.proto'),
            // Usamos variables del .env
            url: configService.get<string>(
              'AUTH_SERVICE_GRPC_URL',
              'localhost:50052',
            ),
            loader: {
              keepCase: true,
            },
          },
        }),
      },
    ]),
  ],
  // ... controllers y providers
  controllers: [ApiGatewayController, AuthController],

  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
