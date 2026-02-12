import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { IMenuItemsRepo } from '../interfaces/menut-items.repo.interface';
import { MenuItemsMapper } from '../mappers/menu-items.mapper';

function isUuid(v: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v,
  );
}

@Injectable()
export class ListMenuItemsByRestaurantUseCase {
  constructor(
    @Inject('IMenuItemsRepo') private readonly repo: IMenuItemsRepo,
  ) {}

  async execute(input: {
    restaurantId: string;
    onlyAvailable?: boolean;
    limit?: number;
    offset?: number;
  }) {
    if (!isUuid(input.restaurantId)) {
      throw new RpcException({
        code: 3,
        message: 'restaurantId must be a valid UUID',
      });
    }

    const limit = Math.min(Math.max(input.limit ?? 20, 1), 100);
    const offset = Math.max(input.offset ?? 0, 0);

    const rows = await this.repo.listByRestaurant({
      restaurantId: input.restaurantId,
      onlyAvailable: input.onlyAvailable ?? false,
      limit,
      offset,
    });

    return { items: rows.map((r) => MenuItemsMapper.toProto(r)) };
  }
}
