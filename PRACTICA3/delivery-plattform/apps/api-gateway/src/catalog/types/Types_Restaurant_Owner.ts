export type GetRestaurantByOwnerIdRequest = {
  ownerUserId: string;
  onlyActive?: boolean;
};

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

export type GetRestaurantByOwnerIdResponse = {
  found: boolean;
  restaurant?: Restaurant;
};

export type CreateCompanyResponse = {
  restaurant?: Restaurant;
};

export type CreateCompanyRequest = {
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  merchantTypeId: string;

  ownerUserId: string;
};
