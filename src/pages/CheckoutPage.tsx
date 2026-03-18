import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateOrder } from '@/hooks/useOrders';
import PaymentSection, { type PaymentMethod } from '@/components/PaymentSection';
import CouponSection, { type AppliedCoupon } from '@/components/CouponSection';
import ShippingEstimate, { getShippingFee, type ShippingMethod } from '@/components/ShippingEstimate';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [orderId, setOrderId] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('zalopay');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const discount = appliedCoupon?.discount ?? 0;
  const finalPrice = Math.max(0, totalPrice - discount);

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

  const handlePayment = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phone.trim())) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    if (selectedPayment === 'zalopay') {
      setPaymentLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setPaymentLoading(false);
      toast.info('Đang chuyển hướng đến cổng thanh toán ZaloPay...');
      // Simulate: still create order
      try {
        const code = await createOrder.mutateAsync({
          items,
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
          total: finalPrice,
        });
        setOrderId(code);
        clearCart();
      } catch {
        toast.error('Có lỗi xảy ra khi đặt hàng');
      }
    } else {
      try {
        const code = await createOrder.mutateAsync({
          items,
          customerName: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          note: note.trim(),
          total: finalPrice,
        });
        clearCart();
        toast.success('Đặt hàng thành công!');
        navigate('/order-history');
      } catch {
        toast.error('Có lỗi xảy ra khi đặt hàng');
      }
    }
  };

  const isProcessing = paymentLoading || createOrder.isPending;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl">Đặt hàng</h1>
      </div>

      {/* Order summary */}
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
        <div className="mt-3 space-y-1 border-t border-border pt-3">
          <div className="flex justify-between">
            <span className="font-body text-sm text-muted-foreground">Tạm tính</span>
            <span className="font-body text-sm">{formatPrice(totalPrice)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="font-body text-sm text-green-600">Giảm giá ({appliedCoupon?.code})</span>
              <span className="font-body text-sm font-medium text-green-600">-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1">
            <span className="font-body text-sm font-semibold">Tổng cộng</span>
            <span className="font-body text-sm font-bold">{formatPrice(finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Shipping info */}
      <div className="space-y-4 border-b border-border p-4">
        <h2 className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Thông tin giao hàng</h2>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Họ tên *</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Nguyễn Văn A" />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Số điện thoại *</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="0901234567" />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Địa chỉ giao hàng *</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
        </div>
        <div>
          <label className="mb-1 block font-body text-xs text-muted-foreground">Ghi chú</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground" placeholder="Ghi chú cho đơn hàng (nếu có)" />
        </div>
      </div>

      {/* Coupon */}
      <CouponSection
        totalPrice={totalPrice}
        appliedCoupon={appliedCoupon}
        onApply={setAppliedCoupon}
        onRemove={() => setAppliedCoupon(null)}
      />

      {/* Payment methods */}
      <PaymentSection selectedMethod={selectedPayment} onMethodChange={setSelectedPayment} />

      {/* Fixed checkout button */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isProcessing ? 'Đang xử lý...' : `Xác nhận thanh toán · ${formatPrice(finalPrice)}`}
        </button>
      </div>
    </div>
  );
}
