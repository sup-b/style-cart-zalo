import { Wallet, Package, Truck, Star, Heart, User, CreditCard, Settings, ChevronRight, MapPin, TicketPercent } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDbOrders } from '@/hooks/useOrders';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const orderStatuses = [
  { icon: Wallet, label: 'Chờ thanh toán', path: '/orders/cho-thanh-toan', dbStatus: 'pending' },
  { icon: Package, label: 'Đang xử lý', path: '/orders/dang-xu-ly', dbStatus: 'confirmed' },
  { icon: Truck, label: 'Đang giao', path: '/orders/dang-giao', dbStatus: 'shipping' },
  { icon: Star, label: 'Đánh giá', path: '/orders/danh-gia', dbStatus: 'delivered' },
];

const menuItems = [
  { icon: Heart, label: 'Sản phẩm yêu thích', path: '/wishlist' },
  { icon: MapPin, label: 'Địa chỉ giao hàng', path: '/addresses' },
  { icon: User, label: 'Thông tin tài khoản', path: '/account-info' },
  { icon: CreditCard, label: 'Phương thức thanh toán', path: '/payment-methods' },
  { icon: Settings, label: 'Cài đặt ứng dụng', path: '/settings' },
];

export default function UserProfileSection() {
  const navigate = useNavigate();
  const { data: orders } = useDbOrders();
  const queryClient = useQueryClient();

  // Subscribe to realtime order changes
  useEffect(() => {
    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const getCount = (dbStatus: string) => (orders || []).filter(o => o.status === dbStatus).length;

  return (
    <div className="space-y-4">
      {/* Order Tracking */}
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Đơn mua của tôi</h2>
          <button
            onClick={() => navigate('/order-history')}
            className="font-body text-xs text-muted-foreground"
          >
            Xem lịch sử →
          </button>
        </div>
        <div className="flex items-center justify-around">
          {orderStatuses.map(({ icon: Icon, label, path, dbStatus }) => {
            const count = getCount(dbStatus);
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1.5 py-1 active:opacity-70 transition-opacity"
              >
                <div className="relative">
                  <Icon className="h-6 w-6 text-foreground/70" strokeWidth={1.5} />
                  {count > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                      {count}
                    </span>
                  )}
                </div>
                <span className="font-body text-[10px] text-muted-foreground">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List Menu */}
      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-secondary/50 ${
                i < menuItems.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <Icon className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
              <span className="flex-1 font-body text-sm">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
