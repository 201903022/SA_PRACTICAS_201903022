export type RestaurantType = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
};

export type GetRestaurantByOwnerIdResponse = {
  found: boolean;
  restaurant?: RestaurantType;
};

export type CreateCompanyResponse = {
  restaurant?: RestaurantType;
};
