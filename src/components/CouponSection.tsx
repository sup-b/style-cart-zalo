import { useState } from 'react';
import { Tag, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock coupon data
const MOCK_COUPONS: Record<string, { type: 'percent' | 'fixed'; value: number; minOrder: number; label: string }> = {
  'THEBOX10': { type: 'percent', value: 10, minOrder: 200000, label: 'Giảm 10%' },
  'THEBOX50K': { type: 'fixed', value: 50000, minOrder: 300000, label: 'Giảm 50.000₫' },
  'FREESHIP': { type: 'fixed', value: 30000, minOrder: 0, label: 'Miễn phí vận chuyển' },
  'WELCOME20': { type: 'percent', value: 20, minOrder: 500000, label: 'Giảm 20% cho đơn từ 500K' },
};

export interface AppliedCoupon {
  code: string;
  label: string;
  discount: number;
}

interface CouponSectionProps {
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  onApply: (coupon: AppliedCoupon) => void;
  onRemove: () => void;
}

export default function CouponSection({ totalPrice, appliedCoupon, onApply, onRemove }: CouponSectionProps) {
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }
    if (trimmed.length > 20) {
      toast.error('Mã giảm giá không hợp lệ');
      return;
    }

    setChecking(true);
    // Simulate API call
    setTimeout(() => {
      setChecking(false);
      const coupon = MOCK_COUPONS[trimmed];
      if (!coupon) {
        toast.error('Mã giảm giá không tồn tại hoặc đã hết hạn');
        return;
      }
      if (totalPrice < coupon.minOrder) {
        toast.error(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này`);
        return;
      }
      const discount = coupon.type === 'percent'
        ? Math.round(totalPrice * coupon.value / 100)
        : coupon.value;

      onApply({ code: trimmed, label: coupon.label, discount });
      setCode('');
      toast.success(`Áp dụng mã "${trimmed}" thành công!`);
    }, 800);
  };

  return (
    <div className="border-b border-border px-4 py-4">
      <h2 className="mb-3 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Mã giảm giá
      </h2>

      {appliedCoupon ? (
        <div className="flex items-center gap-2 rounded-lg border border-green-500/50 bg-green-500/5 px-3 py-2.5">
          <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
          <div className="flex-1">
            <p className="font-body text-sm font-semibold text-foreground">{appliedCoupon.code}</p>
            <p className="font-body text-xs text-muted-foreground">{appliedCoupon.label} · Tiết kiệm {appliedCoupon.discount.toLocaleString('vi-VN')}₫</p>
          </div>
          <button type="button" onClick={onRemove} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.slice(0, 20))}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              placeholder="Nhập mã giảm giá"
              className="w-full border border-border bg-background py-2.5 pl-9 pr-3 font-body text-sm uppercase focus:outline-none focus:ring-1 focus:ring-foreground"
              disabled={checking}
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            disabled={checking || !code.trim()}
            className={cn(
              'shrink-0 px-4 py-2.5 font-body text-sm font-semibold transition-opacity disabled:opacity-50',
              'bg-foreground text-background hover:opacity-90'
            )}
          >
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
          </button>
        </div>
      )}

      {!appliedCoupon && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(MOCK_COUPONS).slice(0, 3).map(([c, info]) => (
            <button
              key={c}
              type="button"
              onClick={() => setCode(c)}
              className="rounded-full border border-dashed border-border px-2.5 py-1 font-body text-[10px] font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              {c} · {info.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
