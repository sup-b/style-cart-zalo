import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderStatus } from '@/context/OrderContext';
import type { CartItem } from '@/context/CartContext';

async function fetchOrders(): Promise<Order[]> {
  const { data: orders, error: oe } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (oe) throw oe;

  const { data: items, error: ie } = await supabase.from('order_items').select('*');
  if (ie) throw ie;

  const { data: prods } = await supabase.from('products').select('*');
  const { data: colors } = await supabase.from('product_colors').select('*');
  const { data: variants } = await supabase.from('product_variants').select('*');

  return (orders || []).map(o => {
    const orderItems = (items || []).filter(i => i.order_id === o.id);
    const cartItems: CartItem[] = orderItems.map(oi => {
      const prod = (prods || []).find(p => p.id === oi.product_id);
      const pColors = (colors || []).filter(c => c.product_id === oi.product_id).map(c => ({ name: c.name, hex: c.hex }));
      const pVariants = (variants || []).filter(v => v.product_id === oi.product_id).map(v => ({ size: v.size, color: v.color, stock: v.stock }));
      return {
        product: {
          id: prod?.id || oi.product_id,
          name: prod?.name || '',
          nameVi: prod?.name_vi || '',
          category: (prod?.category || 'ao') as any,
          price: oi.unit_price,
          images: prod?.images || [],
          colors: pColors,
          sizes: [...new Set(pVariants.map(v => v.size))],
          variants: pVariants,
          description: prod?.description || '',
          material: prod?.material || '',
          sold: prod?.sold || 0,
        },
        size: oi.size,
        color: oi.color,
        quantity: oi.quantity,
      };
    });

    return {
      id: o.order_code,
      items: cartItems,
      customerName: o.customer_name,
      phone: o.phone,
      address: o.address,
      note: o.note,
      total: o.total,
      status: o.status as OrderStatus,
      createdAt: o.created_at,
      shippingNote: o.shipping_note,
      _dbId: o.id,
    };
  });
}

export function useDbOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { items: CartItem[]; customerName: string; phone: string; address: string; note: string; total: number }) => {
      const orderCode = `ORD-${Date.now().toString(36).toUpperCase()}`;
      const { data: order, error: oe } = await supabase.from('orders').insert({
        order_code: orderCode,
        customer_name: data.customerName,
        phone: data.phone,
        address: data.address,
        note: data.note,
        total: data.total,
      }).select().single();
      if (oe) throw oe;

      const orderItems = data.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));
      const { error: ie } = await supabase.from('order_items').insert(orderItems);
      if (ie) throw ie;

      return orderCode;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderCode, status }: { orderCode: string; status: OrderStatus }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('order_code', orderCode);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useUpdateShippingNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderCode, note }: { orderCode: string; note: string }) => {
      const { error } = await supabase.from('orders').update({ shipping_note: note }).eq('order_code', orderCode);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}
