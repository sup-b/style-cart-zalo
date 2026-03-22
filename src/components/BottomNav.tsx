import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const navItems = [
  { path: '/', icon: Home, label: 'Trang chủ' },
  { path: '/categories', icon: LayoutGrid, label: 'Danh mục' },
  { path: '/cart', icon: ShoppingBag, label: 'Giỏ hàng' },
  { path: '/profile', icon: User, label: 'Cá nhân' },
];

export default function BottomNav() {
  const location = useLocation();
  const { totalItems } = useCart();

  const hiddenPaths = ['/admin', '/checkout', '/order-success'];
  if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
          return (
            <Link key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-3 py-1">
              <Icon className={`h-5 w-5 transition-colors ${active ? 'text-foreground' : 'text-muted-foreground'}`} strokeWidth={active ? 2 : 1.5} />
              <span className={`text-[10px] font-body tracking-wide ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
              {path === '/cart' && totalItems > 0 && (
                <span className="absolute -top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-warm text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
