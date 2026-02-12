export type ListMenuItemsByRestaurantInput = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};
