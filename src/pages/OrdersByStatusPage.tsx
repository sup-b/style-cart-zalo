import { ArrowLeft, Wallet, Package, Truck, Star, ShoppingBag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDbOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/data/products';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrderStatus } from '@/context/OrderContext';

const statusConfig: Record<string, { label: string; icon: any; dbStatus: OrderStatus }> = {
  'cho-thanh-toan': { label: 'Chờ thanh toán', icon: Wallet, dbStatus: 'pending' },
  'dang-xu-ly': { label: 'Đang xử lý', icon: Package, dbStatus: 'confirmed' },
  'dang-giao': { label: 'Đang giao', icon: Truck, dbStatus: 'shipping' },
  'danh-gia': { label: 'Đánh giá', icon: Star, dbStatus: 'delivered' },
};

const statusBadge: Record<OrderStatus, { text: string; color: string }> = {
  pending: { text: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700' },
  confirmed: { text: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
  shipping: { text: 'Đang giao', color: 'bg-primary/10 text-primary' },
  delivered: { text: 'Đã giao', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { text: 'Đã hủy', color: 'bg-destructive/10 text-destructive' },
};

export default function OrdersByStatusPage() {
  const { status } = useParams<{ status: string }>();
  const navigate = useNavigate();
  const { data: orders, isLoading } = useDbOrders();

  const config = statusConfig[status || ''];
  if (!config) {
    navigate('/profile');
    return null;
  }

  const Icon = config.icon;
  const filtered = (orders || []).filter(o => o.status === config.dbStatus);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-lg">{config.label}</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 pt-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="font-body text-sm text-muted-foreground">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          {filtered.map(order => {
            const badge = statusBadge[order.status];
            return (
              <div key={order.id} className="rounded-xl bg-card p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs text-muted-foreground">{order.id}</span>
                  <span className={`rounded-full px-2.5 py-0.5 font-body text-[10px] font-medium ${badge.color}`}>
                    {badge.text}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        {item.product.images[0] && (
                          <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium truncate">{item.product.nameVi || item.product.name}</p>
                        <p className="font-body text-[10px] text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="font-body text-[10px] text-muted-foreground">+{order.items.length - 2} sản phẩm khác</p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="font-body text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  <span className="font-body text-sm font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
