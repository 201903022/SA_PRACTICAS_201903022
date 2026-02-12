import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ListMenuItemsByRestaurantUseCase } from './usecases/list-menu-items-by-restaurant.usecase';
import type { CreateMenuItemRequest, CreateMenuItemResponse } from './types';
import { CreateMenuItemUseCase } from './usecases/create-menut-item.usecase';
import { MenuItemDto } from './types/menut-item.dto';
import { MenuItemsMapper } from './mappers/menu-items.mapper';

// Tipos "shape" del proto (si no usas types generados)
type ListMenuItemsByRestaurantRequest = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};

type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string; // si en DB es null -> mandar ""
  price: number; // proto double
  currency: string;
  isAvailable: boolean;
};

type ListMenuItemsByRestaurantResponse = {
  items: MenuItem[];
};

type CreateMenuItemDtoResponse = { item: MenuItemDto };

@Controller()
export class MenuItemsController {
  constructor(
    private readonly listMenuItemsByRestaurantUC: ListMenuItemsByRestaurantUseCase,
    private readonly createMenuItemUC: CreateMenuItemUseCase,
  ) {}

  @GrpcMethod('CatalogService', 'ListMenuItemsByRestaurant')
  async listMenuItemsByRestaurant(
    req: ListMenuItemsByRestaurantRequest,
  ): Promise<ListMenuItemsByRestaurantResponse> {
    return this.listMenuItemsByRestaurantUC.execute(req);
  }

  @GrpcMethod('CatalogService', 'CreateMenuItem')
  async createMenuItem(
    req: CreateMenuItemRequest,
  ): Promise<CreateMenuItemDtoResponse> {
    const row = await this.createMenuItemUC.execute(req); // <- MenuItemRow
    return { item: MenuItemsMapper.toDto(row) };
  }
}
