import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderItem } from '../interfaces/oders/create-orders.interfaces';

interface CartContextType {
    cartItems: OrderItem[];
    restaurantId: string | null;
    restaurantName: string | null;
    addToCart: (item: OrderItem, resId: string, resName: string) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [restaurantName, setRestaurantName] = useState<string | null>(null);

    const addToCart = (item: OrderItem, resId: string, resName: string) => {
        if (restaurantId && restaurantId !== resId) {
            if (!confirm(`¿Vaciar carrito de "${restaurantName}" para pedir en "${resName}"?`)) return;
            setCartItems([]);
        }
        setRestaurantId(resId);
        setRestaurantName(resName);
        setCartItems(prev => {
            const exists = prev.find(i => i.menuItemId === item.menuItemId);
            if (exists) return prev.map(i => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, item];
        });
    };

    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ cartItems, restaurantId, restaurantName, addToCart, total, clearCart: () => setCartItems([]), removeFromCart: (id) => setCartItems(prev => prev.filter(i => i.menuItemId !== id)) }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
    return context;
};