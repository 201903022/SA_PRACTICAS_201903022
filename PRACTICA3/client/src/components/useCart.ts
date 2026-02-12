import { useState } from "react";
import { OrderItem } from "../interfaces/oders/create-orders.interfaces";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [restaurantName, setRestaurantName] = useState<string | null>(null);

  const addToCart = (item: OrderItem, itemRestaurantId: string, itemRestaurantName: string) => {
    // Si el usuario intenta agregar de un restaurante distinto, limpiamos el anterior
    if (restaurantId && restaurantId !== itemRestaurantId) {
      if (
        !window.confirm(
          "¿Deseas vaciar el carrito actual para pedir de este nuevo comercio?",
        )
      )
        return;
      setCartItems([]);
    }

    setRestaurantId(itemRestaurantId);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.menuItemId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.menuItemId !== itemId));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return {
    cartItems,
    restaurantId,
    addToCart,
    removeFromCart,
    total,
    clearCart: () => setCartItems([]),
  };
};
