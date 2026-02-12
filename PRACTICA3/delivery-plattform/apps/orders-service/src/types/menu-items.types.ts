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

export type Restaurant = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
};

export type GetRestaurantResponse = { restaurant?: Restaurant };
