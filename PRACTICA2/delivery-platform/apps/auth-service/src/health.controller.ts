import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    await this.prisma.$queryRawUnsafe('SELECT 1');
    return { status: 'ok', service: 'auth-service', db: 'ok' };
  }
}
