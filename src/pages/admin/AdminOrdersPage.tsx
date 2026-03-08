import { useOrders, OrderStatus } from '@/context/OrderContext';
import { formatPrice } from '@/data/products';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', shipping: 'Đang giao', delivered: 'Đã giao', cancelled: 'Đã hủy',
};
const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', shipping: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateShippingNote } = useOrders();
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (sorted.length === 0) return <div className="py-20 text-center font-body text-sm text-muted-foreground">Chưa có đơn hàng nào</div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-semibold">Quản lý đơn hàng</h1>
      <div className="space-y-3">
        {sorted.map(order => (
          <div key={order.id} className="rounded-sm border border-border bg-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-sm font-semibold">{order.id}</p>
                <p className="font-body text-[11px] text-muted-foreground">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-body font-semibold ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <div className="space-y-1 text-xs font-body">
              <p><span className="text-muted-foreground">KH:</span> {order.customerName}</p>
              <p><span className="text-muted-foreground">SĐT:</span> {order.phone}</p>
              <p><span className="text-muted-foreground">Địa chỉ:</span> {order.address}</p>
              {order.note && <p><span className="text-muted-foreground">Ghi chú:</span> {order.note}</p>}
            </div>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] font-body">
                  <div className="h-8 w-7 shrink-0 overflow-hidden bg-secondary"><img src={item.product.images[0]} alt="" className="h-full w-full object-cover" /></div>
                  <span className="flex-1">{item.product.nameVi} ({item.color}/{item.size}) ×{item.quantity}</span>
                  <span className="font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-body text-xs font-bold">Tổng: {formatPrice(order.total)}</span>
              <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                className="border border-border bg-background px-2 py-1 font-body text-xs focus:outline-none">
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <input value={order.shippingNote} onChange={e => updateShippingNote(order.id, e.target.value)}
              placeholder="Ghi chú vận chuyển..."
              className="w-full border border-border bg-background px-3 py-2 font-body text-xs focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}
