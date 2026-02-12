import { CreateMenuItemParams } from '../types';
import { ListMenuItemsByRestaurantParams } from '../types/list-menu-items-params.type';
import { MenuItemRow } from '../types/menut-item-row.type';

// DTOs, Types y Interfaces para el repositorio de MenuItems
export interface IMenuItemsRepo {
  listByRestaurant(
    params: ListMenuItemsByRestaurantParams,
  ): Promise<MenuItemRow[]>;
  create(params: CreateMenuItemParams): Promise<MenuItemRow>;
}
