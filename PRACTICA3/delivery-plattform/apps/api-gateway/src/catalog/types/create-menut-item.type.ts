export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
};

export type CreateMenuItemRequest = {
  ownerUserId: string; // del JWT
  name: string;
  description?: string;
  price: number;
  currency?: string;
  isAvailable?: boolean;
  categoryIds?: string[];
};

export type CreateMenuItemResponse = { item: MenuItem };

export type ListMenuItemsByRestaurantRequest = {
  restaurantId: string;
  onlyAvailable?: boolean;
  limit?: number;
  offset?: number;
};

export type ListMenuItemsByRestaurantResponse = { items: MenuItem[] };
