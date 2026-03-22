import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '@/data/products';

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('cart') || '[]'); } catch { return []; }
  });

  const persistItems = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addItem = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color);
      const next = existing
        ? prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { product, size, color, quantity }];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color));
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }
    setItems(prev => {
      const next = prev.map(i =>
        i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity } : i
      );
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => { setItems([]); localStorage.removeItem('cart'); }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
