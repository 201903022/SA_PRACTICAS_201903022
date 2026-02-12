import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { BcryptService } from './bycrypt/bycrypt.service';
import { EnvConfig } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';
import { UsersRepository } from './repository/users.repository';
import { RolesRepository } from './repository/roles.repository';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/auth-service/.env', '.env'],
      load: [EnvConfig],
      validationSchema: JoiValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_ACCESS_SECRET');
        const expiresIn = configService.get<string>('JWT_ACCESS_TTL');

        return {
          secret: secret,
          signOptions: {
            expiresIn: expiresIn as never,
          },
        };
      },
    }),
  ],
  controllers: [AuthController, HealthController],
  providers: [
    AuthServiceService,
    BcryptService,
    UsersRepository,
    RolesRepository,
  ],
})
export class AuthServiceModule {}
