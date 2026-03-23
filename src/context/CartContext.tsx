import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Product } from '@/data/products';

export type CartItem = {
  product: Product;
  size: string;
  color: string;
  quantity: number;
};

/** Unique key for a cart item */
export const cartItemKey = (item: { product: { id: string }; size: string; color: string }) =>
  `${item.product.id}::${item.size}::${item.color}`;

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string, quantity?: number) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // Selection
  selectedKeys: Set<string>;
  toggleSelect: (key: string) => void;
  selectAll: (select: boolean) => void;
  removeSelectedItems: () => void;
  selectedTotal: number;
  selectedCount: number;
  /** Remove only the selected items from cart (used after checkout) */
  clearSelectedItems: () => void;
  /** Get only selected CartItems */
  selectedItems: CartItem[];
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  });
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => new Set());

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size && i.color === color);
      const next = existing
        ? prev.map(i => i === existing ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { product, size, color, quantity }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string, color: string) => {
    const key = `${productId}::${size}::${color}`;
    setSelectedKeys(prev => { const n = new Set(prev); n.delete(key); return n; });
    setItems(prev => {
      const next = prev.filter(i => !(i.product.id === productId && i.size === size && i.color === color));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) { removeItem(productId, size, color); return; }
    setItems(prev => {
      const next = prev.map(i =>
        i.product.id === productId && i.size === size && i.color === color ? { ...i, quantity } : i
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setSelectedKeys(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Selection actions
  const toggleSelect = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const selectAll = useCallback((select: boolean) => {
    if (select) {
      setSelectedKeys(new Set(items.map(cartItemKey)));
    } else {
      setSelectedKeys(new Set());
    }
  }, [items]);

  const removeSelectedItems = useCallback(() => {
    setItems(prev => {
      const next = prev.filter(i => !selectedKeys.has(cartItemKey(i)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSelectedKeys(new Set());
  }, [selectedKeys]);

  const clearSelectedItems = useCallback(() => {
    setItems(prev => {
      const next = prev.filter(i => !selectedKeys.has(cartItemKey(i)));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSelectedKeys(new Set());
  }, [selectedKeys]);

  const selectedItems = useMemo(() => items.filter(i => selectedKeys.has(cartItemKey(i))), [items, selectedKeys]);
  const selectedTotal = useMemo(() => selectedItems.reduce((s, i) => s + i.product.price * i.quantity, 0), [selectedItems]);
  const selectedCount = useMemo(() => selectedItems.reduce((s, i) => s + i.quantity, 0), [selectedItems]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice,
      selectedKeys, toggleSelect, selectAll, removeSelectedItems,
      selectedTotal, selectedCount, clearSelectedItems, selectedItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
