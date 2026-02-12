// src/menu-items/mappers/menu-items.mapper.ts
import type { MenuItemRow, ProtoMenuItem } from '../types';
import { MenuItemDto } from '../types/menut-item.dto';

export class MenuItemsMapper {
  static toProto(row: MenuItemRow): ProtoMenuItem {
    const priceNumber = row.price.toNumber();

    return {
      id: row.id,
      restaurantId: row.restaurant_id,
      name: row.name,
      description: row.description ?? '',
      price: row.price.toNumber(),
      currency: row.currency ?? 'GTQ',
      isAvailable: row.is_available,
    };
  }

  static toDto(row: MenuItemRow): MenuItemDto {
    return {
      id: row.id,
      restaurant_id: row.restaurant_id,
      name: row.name,
      description: row.description,
      price: row.price.toString(), // o Number(row.price) si tu DTO lo quiere number
      currency: row.currency,
      is_available: row.is_available,
    };
  }
}
