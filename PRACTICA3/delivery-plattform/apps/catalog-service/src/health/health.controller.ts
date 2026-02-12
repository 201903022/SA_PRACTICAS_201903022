import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prismaSvc: PrismaService) {}
  @GrpcMethod('CatalogService', 'Health')
  async health() {
    const r = await this.prismaSvc.restaurants.findFirst();
    console.log('Health check - anyRestaurant:');
    console.log(r);
    return {
      status: 'ok',
      service: 'catalog-service',
      ts: Date.now(),
      anyRestaurant: r
        ? {
            id: r.id,
            name: r.name,
            address: r.address,
            phone: r.phone ?? '',
            alias: r.alias ?? '',
            openingHours: r.opening_hours ?? '',
            isActive: r.is_active,
            merchantTypeId: r.merchant_type_id,
          }
        : undefined,
    };
  }
}
