import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ListMenuItemsByRestaurantUseCase } from '../usecases/list-menu-items-by-restaurant.usecase';
import { CreateMenuItemUseCase } from '../usecases/create-menut-item.usecase';
import type { CreateMenuItemRequest } from '../types';
import { MenuItemDto } from '../types/menut-item.dto';
import { MenuItemsMapper } from '../mappers/menu-items.mapper';

type ListMenuItemsByRestaurantRequest = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};

type CreateMenuItemDtoResponse = { item: MenuItemDto };

@Controller()
export class MenuItemsGrpcController {
  constructor(
    private readonly listByRestaurantUC: ListMenuItemsByRestaurantUseCase,
    private readonly createMenuItemUC: CreateMenuItemUseCase,
  ) {}

  @GrpcMethod('CatalogService', 'ListMenuItemsByRestaurant')
  async listMenuItemsByRestaurant(req: ListMenuItemsByRestaurantRequest) {
    return this.listByRestaurantUC.execute(req);
  }

  @GrpcMethod('CatalogService', 'CreateMenuItem')
  async createMenuItem(
    req: CreateMenuItemRequest,
  ): Promise<CreateMenuItemDtoResponse> {
    const row = await this.createMenuItemUC.execute(req); // <- MenuItemRow
    return { item: MenuItemsMapper.toDto(row) };
  }
}
