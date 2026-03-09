import { formatPrice } from '@/data/products';
import { ShoppingBag, Package, TrendingUp, ClipboardList } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useDbOrders } from '@/hooks/useOrders';

export default function AdminDashboardPage() {
  const { data: orders = [] } = useDbOrders();
  const { data: products = [] } = useProducts();

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const stats = [
    { label: 'Doanh thu', value: formatPrice(totalRevenue), icon: TrendingUp, accent: 'bg-green-50 text-green-700' },
    { label: 'Đơn hàng', value: totalOrders.toString(), icon: ClipboardList, accent: 'bg-blue-50 text-blue-700' },
    { label: 'Chờ xử lý', value: pendingOrders.toString(), icon: ShoppingBag, accent: 'bg-yellow-50 text-yellow-700' },
    { label: 'Sản phẩm', value: totalProducts.toString(), icon: Package, accent: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold">Tổng quan</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-sm border border-border bg-card p-4 space-y-2">
            <div className={`inline-flex rounded-sm p-2 ${s.accent}`}><s.icon className="h-4 w-4" /></div>
            <p className="font-body text-xs text-muted-foreground">{s.label}</p>
            <p className="font-display text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Đơn hàng gần đây</h2>
        {orders.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">Chưa có đơn hàng</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between rounded-sm border border-border bg-card px-4 py-3">
                <div>
                  <p className="font-body text-sm font-medium">{o.id}</p>
                  <p className="font-body text-[11px] text-muted-foreground">{o.customerName} · {new Date(o.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="font-body text-sm font-semibold">{formatPrice(o.total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
