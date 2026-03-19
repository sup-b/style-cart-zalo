import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

type Props = {
  totalPrice: number;
  customerName: string;
  phone: string;
  address: string;
  selectedPayment: string;
  cartEmpty: boolean;
  onSubmit: () => Promise<void>;
};

export default function CheckoutActionBar({
  totalPrice,
  customerName,
  phone,
  address,
  selectedPayment,
  cartEmpty,
  onSubmit,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (cartEmpty) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      toast.warning('Vui lòng thêm địa chỉ giao hàng');
      return;
    }
    if (!/^[0-9]{10,11}$/.test(phone.trim())) {
      toast.warning('Số điện thoại không hợp lệ');
      return;
    }
    if (!selectedPayment) {
      toast.warning('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1800));
      await onSubmit();
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
    >
      <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
        {/* Left: Total */}
        <div className="flex flex-col">
          <span className="font-body text-[11px] text-muted-foreground">Tổng thanh toán</span>
          <span className="font-display text-lg font-bold text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Right: Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isSubmitting}
          className="flex min-w-[45%] items-center justify-center gap-2 rounded-lg bg-foreground px-6 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-background transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            'Đặt Hàng'
          )}
        </button>
      </div>
    </motion.div>
  );
}
