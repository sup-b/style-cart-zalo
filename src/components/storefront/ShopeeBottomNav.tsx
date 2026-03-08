import { Home, Grid3X3, Radio, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', icon: Home, label: 'Trang chủ' },
  { path: '/products', icon: Grid3X3, label: 'Danh mục' },
  { path: '/live', icon: Radio, label: 'Live' },
  { path: '/notifications', icon: Bell, label: 'Thông báo', badge: 5 },
  { path: '/profile', icon: User, label: 'Tôi' },
];

export default function ShopeeBottomNav() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex max-w-md items-center justify-around py-1.5">
        {tabs.map(({ path, icon: Icon, label, badge }) => {
          const active = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path);

          return (
            <Link key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-2 py-0.5">
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                  fill={active ? 'currentColor' : 'none'}
                />
                {badge && (
                  <span className="absolute -right-2 -top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-badge-red px-0.5 font-body text-[8px] font-bold text-primary-foreground">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`font-body text-[10px] ${active ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
