import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateOrder } from '@/hooks/useOrders';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [orderId, setOrderId] = useState('');

  if (orderId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-8 pb-20 text-center">
        <CheckCircle className="h-16 w-16 text-foreground animate-fade-in" />
        <h1 className="font-display text-2xl">Đặt hàng thành công!</h1>
        <p className="font-body text-sm text-muted-foreground">Mã đơn hàng: <span className="font-semibold text-foreground">{orderId}</span></p>
        <p className="font-body text-xs text-muted-foreground">Chúng tôi sẽ liên hệ để xác nhận đơn hàng qua Zalo.</p>
        <button onClick={() => navigate('/')} className="mt-4 border border-foreground px-8 py-3 font-body text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background">
          Về trang chủ
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phone.trim())) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }
    try {
      const code = await createOrder.mutateAsync({
        items,
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        note: note.trim(),
        total: totalPrice,
      });
      setOrderId(code);
      clearCart();
    } catch {
      toast.error('Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl">Đặt hàng</h1>
      </div>

      <div className="border-b border-border px-4 py-4">
        <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Đơn hàng ({items.length} sản phẩm)</h2>
        {items.map(item => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex items-center gap-3 py-2">
            <div className="h-12 w-10 shrink-0 overflow-hidden bg-secondary">
              <img src={item.product.images[0]} alt={item.product.nameVi} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-body text-xs font-medium">{item.product.nameVi}</p>
              <p className="font-body text-[10px] text-muted-foreground">{item.color} / {item.size} × {item.quantity}</p>
            </div>
            <span className="font-body text-xs font-semibold">{formatPrice(item.product.price * item.quantity)}</span>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t border-border pt-3">
          <span className="font-body text-sm font-semibold">Tổng cộng</span>
          <span className="font-body text-sm font-bold">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Thông tin giao hàng</h2>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Họ tên *</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Nguyễn Văn A" required />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Số điện thoại *</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="0901234567" required />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Địa chỉ giao hàng *</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" required />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Ghi chú</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Ghi chú cho đơn hàng (nếu có)" />
        </div>
        <button type="submit" disabled={createOrder.isPending}
          className="w-full bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50">
          {createOrder.isPending ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
        </button>
      </form>
    </div>
  );
}
