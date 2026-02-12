export type GetRestaurantByOwnerIdInput = {
  ownerUserId: string;
  onlyActive?: boolean;
};

export type RestaurantDto = {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
  merchantTypeId: string;
  ownerUserId: string;
};
