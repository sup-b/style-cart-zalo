import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/data/products';

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderCode = (location.state as any)?.orderCode || '';
  const totalPrice = (location.state as any)?.totalPrice || 0;

  useEffect(() => {
    if (!orderCode) {
      navigate('/', { replace: true });
    }
  }, [orderCode, navigate]);

  if (!orderCode) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h1 className="font-display text-2xl">🎉 Đặt hàng thành công!</h1>
        <p className="font-body text-sm text-muted-foreground">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận sớm nhất.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs space-y-3 rounded-xl border border-border bg-secondary/30 p-4"
      >
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-muted-foreground">Mã đơn hàng</span>
          <span className="font-body text-sm font-bold text-foreground">{orderCode}</span>
        </div>
        {totalPrice > 0 && (
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-muted-foreground">Tổng thanh toán</span>
            <span className="font-body text-sm font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-body text-xs text-muted-foreground">Trạng thái</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs font-medium text-primary">
            <Package className="h-3 w-3" />
            Đang xử lý
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex w-full max-w-xs flex-col gap-3 pt-2"
      >
        <button
          onClick={() => navigate('/order-history')}
          className="flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-body text-sm font-medium transition-colors hover:bg-secondary"
        >
          Xem đơn hàng
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-foreground px-6 py-3 font-body text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Về trang chủ
        </button>
      </motion.div>
    </div>
  );
}
