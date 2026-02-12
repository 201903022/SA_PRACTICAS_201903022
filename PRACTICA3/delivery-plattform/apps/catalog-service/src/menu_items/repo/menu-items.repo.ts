import { Injectable } from '@nestjs/common';
import { IMenuItemsRepo } from '../interfaces/menut-items.repo.interface';
import { ListMenuItemsByRestaurantParams } from '../types/list-menu-items-params.type';
import { MenuItemRow, menuItemSelect } from '../types/menut-item-row.type';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuItemParams } from '../types';

@Injectable()
export class MenuItemsRepository implements IMenuItemsRepo {
  constructor(private readonly prisma: PrismaService) {}

  async listByRestaurant(
    params: ListMenuItemsByRestaurantParams,
  ): Promise<MenuItemRow[]> {
    const { restaurantId, onlyAvailable, limit, offset } = params;

    return (await this.prisma.menu_items.findMany({
      where: {
        restaurant_id: restaurantId,
        ...(onlyAvailable ? { is_available: true } : {}),
      },
      take: limit,
      skip: offset,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        restaurant_id: true,
        name: true,
        description: true,
        price: true,
        currency: true,
        is_available: true,
      },
    })) as unknown as MenuItemRow[];
  }

  async create(params: CreateMenuItemParams): Promise<MenuItemRow> {
    return this.prisma.menu_items.create({
      data: {
        restaurant_id: params.restaurantId,
        name: params.name.trim(),
        description: params.description?.trim()
          ? params.description.trim()
          : null,
        price: params.price,
        currency: (params.currency?.trim() || 'GTQ').slice(0, 3),
        is_available: params.isAvailable ?? true,
      },
      select: menuItemSelect,
    });
  }
}
