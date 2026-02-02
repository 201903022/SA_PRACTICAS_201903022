import { Module } from '@nestjs/common';
import { AuthController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from './health.controller';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/auth-service/.env', '.env'],
    }),
    PrismaModule,
  ],
  controllers: [AuthController, HealthController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
