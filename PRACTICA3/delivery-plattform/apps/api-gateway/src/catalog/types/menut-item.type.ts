export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
};

export type ListMenuItemsByRestaurantResponse = { items: MenuItem[] };

export type ListMenuItemsByRestaurantRequest = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};
