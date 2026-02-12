export type CreateMenuItemParams = {
  restaurantId: string; // ya resuelto con ownerUserId en el usecase
  name: string;
  description?: string | null;
  price: number;
  currency?: string;
  isAvailable?: boolean;
};
