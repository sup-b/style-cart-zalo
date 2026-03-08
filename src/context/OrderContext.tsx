import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  note: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  shippingNote: string;
};

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'createdAt' | 'shippingNote'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateShippingNote: (orderId: string, note: string) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem('orders') || '[]'); } catch { return []; }
  });

  const save = (o: Order[]) => { localStorage.setItem('orders', JSON.stringify(o)); setOrders(o); };

  const addOrder = useCallback((order: Omit<Order, 'id' | 'status' | 'createdAt' | 'shippingNote'>) => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const newOrder: Order = { ...order, id, status: 'pending', createdAt: new Date().toISOString(), shippingNote: '' };
    save([...orders, newOrder]);
    return id;
  }, [orders]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    save(orders.map(o => o.id === orderId ? { ...o, status } : o));
  }, [orders]);

  const updateShippingNote = useCallback((orderId: string, note: string) => {
    save(orders.map(o => o.id === orderId ? { ...o, shippingNote: note } : o));
  }, [orders]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateShippingNote }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
};
