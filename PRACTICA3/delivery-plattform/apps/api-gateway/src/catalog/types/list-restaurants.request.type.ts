import { Restaurant } from './Types_Restaurant_Owner';

export type ListRestaurantsRequest = {
  onlyActive?: boolean;
  limit?: number;
  offset?: number;
};
export type ListRestaurantsResponse = {
  restaurants: Restaurant[];
};
