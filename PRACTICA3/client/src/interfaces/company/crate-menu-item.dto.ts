export class CreateMenuItemDto {
  name!: string;

  description?: string;

  price!: number;

  currency?: string; // "GTQ"

  isAvailable?: boolean;

  categoryIds?: string[];
}
