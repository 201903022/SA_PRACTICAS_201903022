import { Prisma } from '../../../../../node_modules/.prisma/catalog-client';
export type MenuItemRow = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal; // Prisma Decimal
  currency: string;
  is_available: boolean;
};

export const menuItemSelect = {
  id: true,
  restaurant_id: true,
  name: true,
  description: true,
  price: true,
  currency: true,
  is_available: true,
} satisfies Prisma.menu_itemsSelect;
