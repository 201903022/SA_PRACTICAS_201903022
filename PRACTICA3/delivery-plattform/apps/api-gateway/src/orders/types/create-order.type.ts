export type CreateOrderRequest = {
  customerUserId: string;
  restaurantId: string;
  deliveryAddress: string;
  items: { menuItemId: string; quantity: number; expectedPrice?: number }[];
  notes?: string;
};

export type CreateOrderResponse = {
  orderId: string;
  status: string;
  subtotal: number;
  currency: string;
};
