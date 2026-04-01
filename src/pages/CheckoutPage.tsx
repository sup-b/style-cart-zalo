import { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/data/products';
import { ArrowLeft, MapPin, Plus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAddresses, type Address } from '@/hooks/useAddresses';
import { useAuth } from '@/context/AuthContext';
import PaymentSection, { type PaymentMethod } from '@/components/PaymentSection';
import CouponSection, { type AppliedCoupon } from '@/components/CouponSection';
import CheckoutActionBar from '@/components/CheckoutActionBar';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';

function calculateShippingFee(address: Address | null, subTotal: number): number {
  if (!address) return 0;
  if (subTotal >= 500000) return 0;
  const city = address.city.toLowerCase();
  if (city.includes('hà nội') || city.includes('hồ chí minh') || city.includes('ha noi') || city.includes('ho chi minh')) {
    return 20000;
  }
  return 30000;
}

function formatAddressString(addr: Address): string {
  return [addr.address_line, addr.district, addr.city].filter(Boolean).join(', ');
}

export default function CheckoutPage() {
  const { selectedItems: items, selectedTotal: totalPrice, clearSelectedItems } = useCart();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { data: addresses, isLoading: loadingAddresses } = useAddresses();

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('zalopay');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Auto-select default address
  useEffect(() => {
    if (selectedAddressId || !addresses?.length) return;
    const def = addresses.find(a => a.is_default) || addresses[0];
    if (def) setSelectedAddressId(def.id);
  }, [addresses, selectedAddressId]);

  const selectedAddress = useMemo(
    () => addresses?.find(a => a.id === selectedAddressId) ?? null,
    [addresses, selectedAddressId],
  );

  const discount = appliedCoupon?.discount ?? 0;
  const shippingFee = calculateShippingFee(selectedAddress, totalPrice);
  const finalPrice = Math.max(0, totalPrice - discount + shippingFee);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      toast.warning('Vui lòng chọn địa chỉ giao hàng để tiếp tục');
      return;
    }
    const code = await createOrder.mutateAsync({
      items,
      customerName: selectedAddress.recipient_name,
      phone: selectedAddress.phone,
      address: formatAddressString(selectedAddress),
      note: note.trim(),
      total: finalPrice,
    });
    clearSelectedItems();
    toast.success('🎉 Đặt hàng thành công!');
    navigate('/order-success', { state: { orderCode: code, totalPrice: finalPrice } });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-xl">Đặt hàng</h1>
      </div>

      {/* Shipping Address */}
      <div className="border-b border-border px-4 py-4">
        <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Địa chỉ giao hàng
        </h2>

        {loadingAddresses ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ) : !addresses?.length ? (
          /* Empty state */
          <button
            onClick={() => navigate('/address')}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-6 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-5 w-5" />
            <span className="font-body text-sm font-medium">Thêm địa chỉ giao hàng</span>
          </button>
        ) : selectedAddress ? (
          /* Selected address card */
          <div className="relative rounded-lg border border-border bg-secondary/30 p-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold">
                  {selectedAddress.recipient_name}
                  <span className="ml-2 font-normal text-muted-foreground">{selectedAddress.phone}</span>
                </p>
                <p className="mt-0.5 font-body text-xs text-muted-foreground leading-relaxed">
                  {formatAddressString(selectedAddress)}
                </p>
              </div>
              <button
                onClick={() => setDrawerOpen(true)}
                className="shrink-0 font-body text-xs font-semibold text-primary"
              >
                Thay đổi
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Order summary */}
      <div className="border-b border-border px-4 py-4">
        <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Đơn hàng ({items.length} sản phẩm)
        </h2>
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

        {/* Price breakdown */}
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
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
            <span className="font-body text-sm">
              {!selectedAddress
                ? <span className="text-muted-foreground italic text-xs">Chọn địa chỉ</span>
                : shippingFee === 0
                  ? <span className="text-green-600 font-medium">Miễn phí</span>
                  : formatPrice(shippingFee)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2">
            <span className="font-body text-sm font-semibold">Tổng thanh toán</span>
            <span className="font-display text-base font-bold text-primary">{formatPrice(finalPrice)}</span>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="border-b border-border px-4 py-4">
        <label className="mb-1 block font-body text-xs text-muted-foreground">Ghi chú đơn hàng</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
          placeholder="Ghi chú cho đơn hàng (nếu có)"
        />
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

      <CheckoutActionBar
        totalPrice={finalPrice}
        customerName={selectedAddress?.recipient_name ?? ''}
        phone={selectedAddress?.phone ?? ''}
        address={selectedAddress ? formatAddressString(selectedAddress) : ''}
        selectedPayment={selectedPayment}
        cartEmpty={items.length === 0}
        onSubmit={handleSubmitOrder}
      />

      {/* Address picker drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader>
            <DrawerTitle className="font-display text-lg">Chọn địa chỉ giao hàng</DrawerTitle>
            <DrawerDescription className="font-body text-xs text-muted-foreground">
              Chọn một địa chỉ hoặc thêm địa chỉ mới
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4 space-y-2">
            {addresses?.map(addr => (
              <button
                key={addr.id}
                onClick={() => {
                  setSelectedAddressId(addr.id);
                  setDrawerOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                  addr.id === selectedAddressId
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-secondary/50'
                }`}
              >
                {/* Radio indicator */}
                <div className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${
                  addr.id === selectedAddressId ? 'border-primary' : 'border-muted-foreground/40'
                }`}>
                  {addr.id === selectedAddressId && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-semibold">
                    {addr.recipient_name}
                    <span className="ml-2 font-normal text-muted-foreground text-xs">{addr.phone}</span>
                  </p>
                  <p className="mt-0.5 font-body text-xs text-muted-foreground leading-relaxed">
                    {formatAddressString(addr)}
                  </p>
                  {addr.is_default && (
                    <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 font-body text-[10px] font-semibold text-primary">
                      Mặc định
                    </span>
                  )}
                </div>
              </button>
            ))}

            {/* Add new address */}
            <button
              onClick={() => {
                setDrawerOpen(false);
                navigate('/address');
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-4 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="font-body text-sm font-medium">Thêm địa chỉ mới</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
