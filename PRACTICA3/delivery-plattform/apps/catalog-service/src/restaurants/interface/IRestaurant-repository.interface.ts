import { RestaurantDto } from '../dto/restaurant.dto';
import { ListRestaurantsParams } from '../types/list-restaurants-params.type';
import { RestaurantRow } from '../types/restaurant-row.type';

export interface IRestaurantsRepository {
  findOneByOwnerId(params: {
    ownerUserId: string;
    onlyActive: boolean;
  }): Promise<RestaurantRow | null>;

  createCompany(data: RestaurantDto): Promise<RestaurantRow>;
  findAll(params: ListRestaurantsParams): Promise<RestaurantRow[]>;
  findOneById(id: string): Promise<RestaurantRow | null>;
}
