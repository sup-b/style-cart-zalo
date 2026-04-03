import { useState } from 'react';
import { Tag, X, Loader2, CheckCircle, Ticket, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useVoucher } from '@/context/VoucherContext';
import { findVoucherByCode, calculateVoucherDiscount, ALL_VOUCHERS } from '@/data/vouchers';
import type { VoucherData } from '@/data/vouchers';

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
  const [showSaved, setShowSaved] = useState(false);
  const { getSavedVouchers } = useVoucher();

  const savedVouchers = getSavedVouchers();

  const applyVoucher = (voucher: VoucherData) => {
    if (totalPrice < voucher.minOrder) {
      toast.error(`Đơn hàng tối thiểu ${voucher.minOrder.toLocaleString('vi-VN')}₫ để áp dụng mã này`);
      return;
    }
    const discount = calculateVoucherDiscount(voucher, totalPrice);
    onApply({ code: voucher.code, label: voucher.title, discount });
    setCode('');
    setShowSaved(false);
    toast.success(`Áp dụng mã "${voucher.code}" thành công!`);
  };

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const voucher = findVoucherByCode(trimmed);
      if (!voucher) {
        toast.error('Mã giảm giá không tồn tại hoặc đã hết hạn');
        return;
      }
      applyVoucher(voucher);
    }, 600);
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
        <>
          {/* Code input */}
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

          {/* Saved vouchers toggle */}
          {savedVouchers.length > 0 && (
            <button
              type="button"
              onClick={() => setShowSaved(!showSaved)}
              className="mt-2 flex w-full items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 text-left transition-colors hover:bg-secondary/50"
            >
              <span className="font-body text-xs font-medium text-muted-foreground">
                Chọn từ ví voucher ({savedVouchers.length} mã)
              </span>
              {showSaved ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          )}

          {/* Saved voucher list */}
          {showSaved && savedVouchers.length > 0 && (
            <div className="mt-2 space-y-2">
              {savedVouchers.map((v) => {
                const isFreeship = v.type === 'freeship';
                const eligible = totalPrice >= v.minOrder;
                const discount = calculateVoucherDiscount(v, totalPrice);

                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={!eligible}
                    onClick={() => applyVoucher(v)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                      eligible
                        ? 'border-border hover:border-primary hover:bg-primary/5 cursor-pointer'
                        : 'border-border/50 opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      isFreeship ? 'bg-blue-50' : 'bg-red-50'
                    )}>
                      {isFreeship ? (
                        <Truck className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Ticket className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-body text-sm font-semibold', isFreeship ? 'text-blue-600' : 'text-red-600')}>
                        {v.title}
                      </p>
                      <p className="font-body text-[11px] text-muted-foreground">{v.condition}</p>
                      {eligible && (
                        <p className="font-body text-[11px] text-green-600 font-medium">
                          Tiết kiệm {discount.toLocaleString('vi-VN')}₫
                        </p>
                      )}
                      {!eligible && (
                        <p className="font-body text-[10px] text-destructive">
                          Cần thêm {(v.minOrder - totalPrice).toLocaleString('vi-VN')}₫
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 font-mono text-[10px] font-bold tracking-wider text-muted-foreground">
                      {v.code}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick code chips (from all vouchers) */}
          {!showSaved && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ALL_VOUCHERS.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setCode(v.code)}
                  className="rounded-full border border-dashed border-border px-2.5 py-1 font-body text-[10px] font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  {v.code} · {v.title}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
