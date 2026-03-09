import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Package, ClipboardList, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
  { path: '/admin/orders', icon: ClipboardList, label: 'Đơn hàng' },
  { path: '/admin/inventory', icon: Package, label: 'Kho hàng' },
  { path: '/admin/reports', icon: BarChart3, label: 'Báo cáo' },
];

export default function AdminLayout() {
  const { signOut, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setUserRole('user');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm transition-colors ${isActive ? 'bg-secondary font-semibold text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-md md:px-6">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">Dashboard</span>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
