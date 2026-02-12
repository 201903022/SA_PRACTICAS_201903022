export type CreateMenuItemRequest = {
  ownerUserId: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  isAvailable?: boolean;
  categoryIds?: string[];
};
