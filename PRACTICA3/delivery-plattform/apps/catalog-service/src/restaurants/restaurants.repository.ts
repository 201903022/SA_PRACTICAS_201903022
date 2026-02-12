import { Injectable, Logger } from '@nestjs/common';
import { IRestaurantsRepository } from './interface/IRestaurant-repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { ListRestaurantsParams } from './types/list-restaurants-params.type';
import { RestaurantRow } from './types/restaurant-row.type';

@Injectable()
export class RestaurantsRepository implements IRestaurantsRepository {
  private readonly logger = new Logger(RestaurantsRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async findOneByOwnerId(params: { ownerUserId: string; onlyActive: boolean }) {
    console.log('OwnerUserId', params.ownerUserId);
    const { ownerUserId, onlyActive } = params;

    return this.prisma.restaurants.findFirst({
      where: {
        owner_user_id: ownerUserId,
        ...(onlyActive ? { is_active: true } : {}),
      },
      orderBy: { created_at: 'desc' }, // por si tu data estuviera sucia
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        alias: true,
        opening_hours: true,
        is_active: true,
        merchant_type_id: true,
        owner_user_id: true,
      },
    });
  }

  async createCompany(input: {
    name: string;
    address: string;
    phone: string;
    alias: string;
    openingHours: string;
    merchantTypeId: string;
    ownerUserId: string;
  }) {
    console.log('Creando compania');
    return this.prisma.restaurants.create({
      data: {
        name: input.name,
        address: input.address,
        phone: input.phone || null,
        alias: input.alias || null,
        opening_hours: input.openingHours || null,
        is_active: true,
        merchant_type_id: input.merchantTypeId,
        owner_user_id: input.ownerUserId,
      },
    });
  }
  async findAll(params: ListRestaurantsParams): Promise<RestaurantRow[]> {
    const onlyActive = params.onlyActive ?? true;
    const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
    const offset = Math.max(params.offset ?? 0, 0);

    return this.prisma.restaurants.findMany({
      where: onlyActive ? { is_active: true } : {},
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        alias: true,
        opening_hours: true,
        is_active: true,
        merchant_type_id: true,
        owner_user_id: true,
      },
    });
  }

  async findOneById(id: string): Promise<RestaurantRow | null> {
    return this.prisma.restaurants.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        alias: true,
        opening_hours: true,
        is_active: true,
        merchant_type_id: true,
        owner_user_id: true,
      },
    });
  }
}
