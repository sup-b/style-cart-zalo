import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Wallet, Truck, Star, CheckCircle2, XCircle, Clock, Phone, MapPin, StickyNote, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDbOrders } from '@/hooks/useOrders';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/data/products';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import type { OrderStatus } from '@/context/OrderContext';

const statusSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: 'pending', label: 'Chờ thanh toán', icon: Wallet },
  { status: 'confirmed', label: 'Đã xác nhận', icon: Package },
  { status: 'shipping', label: 'Đang giao hàng', icon: Truck },
  { status: 'delivered', label: 'Đã giao hàng', icon: Star },
];

const statusIndex: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  shipping: 2,
  delivered: 3,
  cancelled: -1,
};

const statusColor: Record<OrderStatus, string> = {
  pending: 'text-amber-600',
  confirmed: 'text-blue-600',
  shipping: 'text-primary',
  delivered: 'text-emerald-600',
  cancelled: 'text-destructive',
};

export default function OrderDetailPage() {
  const { orderCode } = useParams<{ orderCode: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useDbOrders();
  const [statusChanged, setStatusChanged] = useState(false);

  // Realtime subscription for this order
  useEffect(() => {
    const channel = supabase
      .channel(`order-detail-${orderCode}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new as any;
          if (updated.order_code === orderCode) {
            setStatusChanged(true);
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setTimeout(() => setStatusChanged(false), 2000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderCode, queryClient]);

  const order = orders?.find(o => o.id === orderCode);
  const currentIdx = order ? statusIndex[order.status] : 0;
  const isCancelled = order?.status === 'cancelled';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 pb-20">
        <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
          <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="space-y-4 p-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center gap-3">
        <XCircle className="h-12 w-12 text-muted-foreground" />
        <p className="font-body text-sm text-muted-foreground">Không tìm thấy đơn hàng</p>
        <button onClick={() => navigate('/order-history')} className="font-body text-xs text-primary underline">
          Quay lại lịch sử đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <div className="flex-1">
          <h1 className="font-display text-base">Chi tiết đơn hàng</h1>
          <p className="font-body text-[10px] text-muted-foreground">{order.id}</p>
        </div>
        <AnimatePresence>
          {statusChanged && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5"
            >
              <RefreshCw className="h-3 w-3 text-emerald-600 animate-spin" />
              <span className="font-body text-[10px] font-medium text-emerald-700">Cập nhật</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-3 p-4">
        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-4 shadow-sm"
        >
          <h2 className="font-display text-sm font-semibold mb-4">
            {isCancelled ? 'Đơn hàng đã bị hủy' : 'Trạng thái đơn hàng'}
          </h2>

          {isCancelled ? (
            <div className="flex items-center gap-3 rounded-lg bg-destructive/10 p-3">
              <XCircle className="h-8 w-8 text-destructive" />
              <div>
                <p className="font-body text-sm font-medium text-destructive">Đã hủy</p>
                <p className="font-body text-[10px] text-muted-foreground">Đơn hàng này đã bị hủy</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {statusSteps.map((step, i) => {
                const isCompleted = i <= currentIdx;
                const isCurrent = i === currentIdx;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="flex items-start gap-3">
                    {/* Vertical line + icon */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{
                          scale: isCurrent ? 1.15 : 1,
                          backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full"
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                        ) : (
                          <Icon className={`h-5 w-5 ${isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                        )}
                        {isCurrent && (
                          <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-primary"
                          />
                        )}
                      </motion.div>
                      {i < statusSteps.length - 1 && (
                        <motion.div
                          initial={false}
                          animate={{
                            backgroundColor: i < currentIdx ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                          }}
                          className="w-0.5 h-8"
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className={`pt-1.5 pb-4 ${isCurrent ? '' : 'opacity-60'}`}>
                      <p className={`font-body text-sm font-medium ${isCurrent ? statusColor[step.status] : ''}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex items-center gap-1 mt-0.5"
                        >
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-body text-[10px] text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Shipping Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-card p-4 shadow-sm space-y-2.5"
        >
          <h2 className="font-display text-sm font-semibold">Thông tin giao hàng</h2>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="font-body text-xs font-medium">{order.customerName}</p>
              <p className="font-body text-[11px] text-muted-foreground">{order.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="font-body text-xs">{order.phone}</p>
          </div>
          {order.note && (
            <div className="flex items-start gap-2">
              <StickyNote className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="font-body text-[11px] text-muted-foreground">{order.note}</p>
            </div>
          )}
          {order.shippingNote && (
            <div className="mt-2 rounded-lg bg-primary/5 p-2.5">
              <p className="font-body text-[10px] font-medium text-primary">📦 Ghi chú vận chuyển</p>
              <p className="font-body text-[11px] text-muted-foreground mt-0.5">{order.shippingNote}</p>
            </div>
          )}
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-card p-4 shadow-sm space-y-3"
        >
          <h2 className="font-display text-sm font-semibold">Sản phẩm ({order.items.length})</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-secondary">
                  {item.product.images[0] && (
                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-medium truncate">{item.product.nameVi || item.product.name}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                </div>
                <span className="font-body text-xs font-semibold shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <span className="font-body text-xs text-muted-foreground">Tổng cộng</span>
            <span className="font-display text-base font-bold text-primary">{formatPrice(order.total)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
