import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiGatewayController } from './api-gateway.controller';
import { AuthController } from './auth/auth.controller';
import { ApiGatewayService } from './api-gateway.service';
import { join } from 'path';
import { existsSync } from 'fs'; // Importante: añade esto
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.vaidation';
import { AdminController } from './admin/admin.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfig],
      isGlobal: true,
      envFilePath: ['apps/api-gateway/.env', '.env'],
      validationSchema: JoiValidationSchema,
    }),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          // --- LOGICA DE RUTA PARA PROTO ---
          // 1. Ruta en Docker/Producción (donde lo movemos en el Dockerfile)
          const dockerProtoPath = join(
            process.cwd(),
            'dist/apps/api-gateway/proto/auth.proto',
          );

          // 2. Ruta alternativa en Docker si el CWD cambia
          const dockerProtoPathAlt = join(__dirname, 'proto/auth.proto');

          // 3. Ruta en Desarrollo Local
          const devProtoPath = join(
            process.cwd(),
            'libs/common/proto/auth.proto',
          );

          const finalProtoPath = existsSync(dockerProtoPath)
            ? dockerProtoPath
            : existsSync(dockerProtoPathAlt)
              ? dockerProtoPathAlt
              : devProtoPath;

          console.log(`[API-GATEWAY] Usando proto en: ${finalProtoPath}`);

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
    ]),
  ],
  controllers: [ApiGatewayController, AuthController, AdminController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
