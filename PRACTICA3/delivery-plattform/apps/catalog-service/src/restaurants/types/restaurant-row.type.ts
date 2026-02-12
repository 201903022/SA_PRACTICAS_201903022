export type RestaurantRow = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  alias: string | null;
  opening_hours: string | null;
  is_active: boolean;
  merchant_type_id: string;
  owner_user_id: string | null;
};
