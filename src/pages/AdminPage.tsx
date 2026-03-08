import { useState } from 'react';
import { products, formatPrice } from '@/data/products';
import { useOrders, OrderStatus } from '@/context/OrderContext';
import { Package, ClipboardList, BarChart3, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};
const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

type Tab = 'inventory' | 'orders' | 'reports';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('orders');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate('/')}><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="font-display text-xl">Quản trị</h1>
        </div>
        <div className="flex border-b border-border">
          {([
            { id: 'orders' as Tab, icon: ClipboardList, label: 'Đơn hàng' },
            { id: 'inventory' as Tab, icon: Package, label: 'Kho hàng' },
            { id: 'reports' as Tab, icon: BarChart3, label: 'Báo cáo' },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 py-3 font-body text-xs uppercase tracking-wider transition-colors ${tab === t.id ? 'border-b-2 border-foreground font-semibold' : 'text-muted-foreground'}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'inventory' && <InventoryTab />}
      {tab === 'reports' && <ReportsTab />}
    </div>
  );
}

function OrdersTab() {
  const { orders, updateOrderStatus, updateShippingNote } = useOrders();
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sorted.length === 0) {
    return <div className="py-20 text-center font-body text-sm text-muted-foreground">Chưa có đơn hàng nào</div>;
  }

  return (
    <div className="divide-y divide-border">
      {sorted.map(order => (
        <div key={order.id} className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-body text-xs font-semibold">{order.id}</p>
              <p className="font-body text-[10px] text-muted-foreground">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-body font-semibold ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>
          <div className="space-y-1">
            <p className="font-body text-xs"><span className="text-muted-foreground">KH:</span> {order.customerName}</p>
            <p className="font-body text-xs"><span className="text-muted-foreground">SĐT:</span> {order.phone}</p>
            <p className="font-body text-xs"><span className="text-muted-foreground">Địa chỉ:</span> {order.address}</p>
            {order.note && <p className="font-body text-xs"><span className="text-muted-foreground">Ghi chú:</span> {order.note}</p>}
          </div>
          <div className="space-y-1">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-8 w-7 shrink-0 overflow-hidden bg-secondary">
                  <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                </div>
                <span className="font-body text-[11px] flex-1">{item.product.nameVi} ({item.color}/{item.size}) ×{item.quantity}</span>
                <span className="font-body text-[11px] font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2">
            <span className="font-body text-xs font-bold">Tổng: {formatPrice(order.total)}</span>
            <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
              className="border border-border bg-background px-2 py-1 font-body text-xs focus:outline-none">
              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <input
              value={order.shippingNote}
              onChange={e => updateShippingNote(order.id, e.target.value)}
              placeholder="Ghi chú vận chuyển..."
              className="w-full border border-border bg-background px-2 py-1.5 font-body text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function InventoryTab() {
  return (
    <div className="divide-y divide-border">
      {products.map(p => (
        <div key={p.id} className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-10 shrink-0 overflow-hidden bg-secondary">
              <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <h3 className="font-display text-sm font-medium">{p.nameVi}</h3>
              <p className="font-body text-[10px] text-muted-foreground">{formatPrice(p.price)}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-1 text-left font-semibold text-muted-foreground">Size</th>
                  <th className="py-1 text-left font-semibold text-muted-foreground">Màu</th>
                  <th className="py-1 text-right font-semibold text-muted-foreground">Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {p.variants.map((v, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="py-1">{v.size}</td>
                    <td className="py-1">{v.color}</td>
                    <td className={`py-1 text-right font-semibold ${v.stock < 5 ? 'text-destructive' : ''}`}>{v.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsTab() {
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold);
  const maxSold = bestSellers[0]?.sold || 1;

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="mb-4 font-display text-lg">Top sản phẩm bán chạy</h2>
        <div className="space-y-3">
          {bestSellers.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="w-5 text-right font-body text-xs font-bold text-muted-foreground">{i + 1}</span>
              <div className="h-10 w-8 shrink-0 overflow-hidden bg-secondary">
                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-body text-xs font-medium">{p.nameVi}</p>
                <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-foreground transition-all" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                </div>
              </div>
              <span className="font-body text-xs font-bold">{p.sold}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
