import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/context/AuthContext';
import PaymentSection, { type PaymentMethod } from '@/components/PaymentSection';
import CouponSection, { type AppliedCoupon } from '@/components/CouponSection';
import ShippingEstimate, { getShippingFee, type ShippingMethod } from '@/components/ShippingEstimate';
import CheckoutActionBar from '@/components/CheckoutActionBar';

export default function CheckoutPage() {
  const { selectedItems: items, selectedTotal: totalPrice, clearSelectedItems } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: addresses } = useAddresses();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('zalopay');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [prefilled, setPrefilled] = useState(false);

  // Auto-fill from default address
  useEffect(() => {
    if (prefilled || !addresses?.length) return;
    const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
    if (defaultAddr) {
      setName(defaultAddr.recipient_name);
      setPhone(defaultAddr.phone);
      setAddress([defaultAddr.address_line, defaultAddr.district, defaultAddr.city].filter(Boolean).join(', '));
      setPrefilled(true);
    }
  }, [addresses, prefilled]);

  const discount = appliedCoupon?.discount ?? 0;
  const shippingFee = getShippingFee(address, totalPrice, shippingMethod);
  const finalPrice = Math.max(0, totalPrice - discount + shippingFee);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async () => {
    const code = await createOrder.mutateAsync({
      items,
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim(),
      total: finalPrice,
    });
    clearCart();
    toast.success('🎉 Đặt hàng thành công!');
    navigate('/order-success', { state: { orderCode: code, totalPrice: finalPrice } });
  };

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
          <div className="flex justify-between">
            <span className="font-body text-sm text-muted-foreground">Phí vận chuyển</span>
            <span className="font-body text-sm">{shippingFee === 0 ? <span className="text-green-600 font-medium">Miễn phí</span> : formatPrice(shippingFee)}</span>
          </div>
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

      {/* Shipping estimate */}
      <ShippingEstimate
        address={address}
        subtotal={totalPrice}
        shippingMethod={shippingMethod}
        onMethodChange={setShippingMethod}
      />

      {/* Coupon */}
      <CouponSection
        totalPrice={totalPrice}
        appliedCoupon={appliedCoupon}
        onApply={setAppliedCoupon}
        onRemove={() => setAppliedCoupon(null)}
      />

      {/* Payment methods */}
      <PaymentSection selectedMethod={selectedPayment} onMethodChange={setSelectedPayment} />

      <CheckoutActionBar
        totalPrice={finalPrice}
        customerName={name}
        phone={phone}
        address={address}
        selectedPayment={selectedPayment}
        cartEmpty={items.length === 0}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
}
