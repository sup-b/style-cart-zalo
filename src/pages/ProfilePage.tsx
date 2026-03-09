import { useNavigate } from 'react-router-dom';
import { Heart, User, CreditCard, Settings, Headphones, ChevronRight, Wallet, Package, Truck, Star, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  { icon: Headphones, label: 'Trung tâm hỗ trợ', path: null },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      toast('Tính năng đang được phát triển', { icon: '🚧' });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Section 1: User Info Header */}
      <div className="bg-gradient-to-br from-foreground to-foreground/80 px-6 pb-8 pt-12 text-background">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background/20">
            <AvatarFallback className="bg-background/10 text-background text-xl font-display">
              TB
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-lg font-semibold">Khách hàng The Box</h1>
            <Badge variant="secondary" className="mt-1 bg-background/15 text-background border-none text-[10px] uppercase tracking-widest">
              Thành viên Bạc
            </Badge>
          </div>
        </div>
      </div>

      {/* Section 2: Order Tracking */}
      <div className="mx-4 -mt-4 rounded-xl bg-card p-4 shadow-sm">
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
                  <span className="absolute -right-2 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {count}
                  </span>
                )}
              </div>
              <span className="font-body text-[10px] text-muted-foreground">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 3: Menu List */}
      <div className="mx-4 mt-4 rounded-xl bg-card shadow-sm overflow-hidden">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleMenuClick(item)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-muted/50 ${
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

      {/* Section 4: Logout */}
      <div className="mx-4 mt-4">
        <button
          onClick={() => toast('Tính năng đang được phát triển', { icon: '🚧' })}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3.5 shadow-sm transition-colors active:bg-muted/50"
        >
          <LogOut className="h-4 w-4 text-red-500" />
          <span className="font-body text-sm font-medium text-red-500">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
