export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  alias: string;
  openingHours: string;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  isAvailable: boolean;
}

export interface MenuCategory {
  restaurant: Restaurant;
  items: MenuItem[];
}
