import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor(private readonly prismaService: PrismaService) {}
  @GrpcMethod('OrdersService', 'Health')
  health() {
    this.logger.log('Health check - anyRestaurant:');
    const databaseSatttus = this.prismaService
      .$connect()
      .then(() => 'connected')
      .catch(() => 'disconnected');
    this.logger.debug(`Database status: ${databaseSatttus}`);
    const orders = this.prismaService.orders.count();
    this.logger.debug(`Orders count: ${orders}`);
    return {
      status: 'ok',
      service: 'orders-service2',
      ts: Date.now(),
      databaseStatus: this.prismaService
        .$connect()
        .then(() => 'connected')
        .catch(() => 'disconnected'),
    };
  }
}
