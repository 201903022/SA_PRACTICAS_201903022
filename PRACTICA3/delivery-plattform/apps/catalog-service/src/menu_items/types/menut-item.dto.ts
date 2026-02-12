export type MenuItemDto = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: string; // <- importante: string, no Prisma.Decimal
  currency: string;
  is_available: boolean;
};
