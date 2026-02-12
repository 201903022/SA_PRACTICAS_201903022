export interface OrderItem {
  menuItemId: string;
  name: string; // Para mostrar en el front
  price: number; // Para calcular subtotal en el front
  quantity: number;
}

export interface CreateOrderRequest {
  restaurantId: string;
  deliveryAddress: string;
  items: { menuItemId: string; quantity: number }[];
  notes?: string;
}
