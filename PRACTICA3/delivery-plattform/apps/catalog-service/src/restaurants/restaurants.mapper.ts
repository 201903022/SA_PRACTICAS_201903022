import { RestaurantDto } from './dto/restaurant.dto';
import { RestaurantRow } from './types/restaurant-row.type';

export class RestaurantsMapper {
  static toDto(r: RestaurantRow): RestaurantDto {
    return {
      id: r.id,
      name: r.name,
      address: r.address,
      phone: r.phone ?? '',
      alias: r.alias ?? '',
      openingHours: r.opening_hours ?? '',
      isActive: r.is_active,
      merchantTypeId: r.merchant_type_id,
      ownerUserId: r.owner_user_id ?? '',
    };
  }
}
