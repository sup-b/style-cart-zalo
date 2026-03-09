import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, CreditCard, Settings, Headphones, ChevronRight, Wallet, Package, Truck, Star, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { user, profile, isLoggedIn, loading, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.path) {
      navigate(item.path);
    } else {
      toast('Tính năng đang được phát triển', { icon: '🚧' });
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Đã đăng xuất');
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Khách';
  const initials = displayName.slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pb-20 space-y-4 p-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Section 1: User Info Header */}
      <div className="bg-gradient-to-br from-foreground to-foreground/80 px-6 pb-8 pt-12 text-background">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background/20">
              <AvatarFallback className="bg-background/10 text-background text-xl font-display">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-display text-lg font-semibold">{displayName}</h1>
              <p className="text-xs text-background/70 font-body">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 bg-background/15 text-background border-none text-[10px] uppercase tracking-widest">
                Thành viên Bạc
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-4">
            <Avatar className="h-16 w-16 border-2 border-background/20">
              <AvatarFallback className="bg-background/10 text-background text-xl font-display">
                ?
              </AvatarFallback>
            </Avatar>
            <p className="font-body text-sm text-background/70">Bạn chưa đăng nhập</p>
            <button
              onClick={() => setAuthOpen(true)}
              className="rounded-full bg-background px-6 py-2 font-body text-xs font-semibold uppercase tracking-widest text-foreground transition-opacity hover:opacity-90"
            >
              Đăng nhập / Đăng ký
            </button>
          </div>
        )}
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
      {isLoggedIn && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3.5 shadow-sm transition-colors active:bg-muted/50"
          >
            <LogOut className="h-4 w-4 text-destructive" />
            <span className="font-body text-sm font-medium text-destructive">Đăng xuất</span>
          </button>
        </div>
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
