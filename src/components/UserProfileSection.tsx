import { Wallet, Package, Truck, Star, Heart, User, CreditCard, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const orderStatuses = [
  { icon: Wallet, label: 'Chờ thanh toán', count: 0 },
  { icon: Package, label: 'Đang xử lý', count: 1 },
  { icon: Truck, label: 'Đang giao', count: 2 },
  { icon: Star, label: 'Đánh giá', count: 0 },
];

const menuItems = [
  { icon: Heart, label: 'Sản phẩm yêu thích', path: '/wishlist' },
  { icon: User, label: 'Thông tin tài khoản', path: null },
  { icon: CreditCard, label: 'Phương thức thanh toán', path: null },
  { icon: Settings, label: 'Cài đặt ứng dụng', path: null },
];

export default function UserProfileSection() {
  const navigate = useNavigate();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      toast(`Đang mở ${item.label}`, { icon: '🚧' });
    }
  };

  return (
    <div className="space-y-4">
      {/* Order Tracking */}
      <div className="rounded-xl bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold">Đơn mua của tôi</h2>
          <button
            onClick={() => toast('Tính năng đang được phát triển', { icon: '🚧' })}
            className="font-body text-xs text-muted-foreground"
          >
            Xem lịch sử →
          </button>
        </div>
        <div className="flex items-center justify-around">
          {orderStatuses.map(({ icon: Icon, label, count }) => (
            <button key={label} className="flex flex-col items-center gap-1.5 py-1 active:opacity-70 transition-opacity">
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
          ))}
        </div>
      </div>

      {/* List Menu */}
      <div className="rounded-xl bg-card shadow-sm overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item)}
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
