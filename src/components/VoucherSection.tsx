import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Ticket, Check, ShoppingBag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoucher } from '@/context/VoucherContext';
import { toast } from 'sonner';
import { ALL_VOUCHERS } from '@/data/vouchers';
import VoucherDetailDrawer from '@/components/VoucherDetailDrawer';
import type { VoucherData } from '@/data/vouchers';

function parseExpDate(expDate: string): Date {
  const [d, m, y] = expDate.split('/').map(Number);
  return new Date(y, m - 1, d, 23, 59, 59);
}

function getCountdown(expDate: string) {
  const now = new Date();
  const exp = parseExpDate(expDate);
  const diff = exp.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, expired: false };
}

function CountdownBadge({ expDate }: { expDate: string }) {
  const [countdown, setCountdown] = useState(() => getCountdown(expDate));

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(expDate)), 60000);
    return () => clearInterval(timer);
  }, [expDate]);

  if (countdown.expired) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive">
        <Clock className="w-3 h-3" /> Hết hạn
      </span>
    );
  }

  const isUrgent = countdown.days <= 3;

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${isUrgent ? 'text-orange-500' : 'text-muted-foreground'}`}>
      <Clock className="w-3 h-3" />
      {countdown.days > 0 ? `Còn ${countdown.days} ngày` : `Còn ${countdown.hours}h`}
    </span>
  );
}

export default function VoucherSection() {
  const navigate = useNavigate();
  const { saveVoucher, isVoucherSaved } = useVoucher();
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  const handleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    saveVoucher(id);
    setJustSavedId(id);
    toast.success('Đã lưu voucher thành công!');
    setTimeout(() => setJustSavedId(null), 2000);
  };

  const handleUseNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/products');
  };

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-base text-foreground">Mã giảm giá cho bạn</h2>
        <button onClick={() => navigate('/vouchers')} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Xem tất cả &gt;
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {ALL_VOUCHERS.map((v) => {
          const saved = isVoucherSaved(v.id);
          const justSaved = justSavedId === v.id;
          const isFreeship = v.type === 'freeship';

          return (
            <motion.div
              key={v.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedVoucher(v)}
              className="flex-shrink-0 w-[270px] flex rounded-xl border border-border bg-card shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
            >
              {/* Left icon panel */}
              <div className={`w-[28%] flex flex-col items-center justify-center gap-1.5 py-3 ${isFreeship ? 'bg-blue-50' : 'bg-red-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFreeship ? 'bg-blue-100' : 'bg-red-100'}`}>
                  {isFreeship
                    ? <Truck className="w-5 h-5 text-blue-500" />
                    : <Ticket className="w-5 h-5 text-red-500" />
                  }
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide ${isFreeship ? 'text-blue-500' : 'text-red-500'}`}>
                  {isFreeship ? 'Freeship' : 'Giảm giá'}
                </span>
              </div>

              {/* Dashed divider with notches */}
              <div className="relative w-0">
                <div className="absolute -top-2 -translate-x-1/2 w-4 h-4 rounded-full bg-background z-10" />
                <div className="absolute -bottom-2 -translate-x-1/2 w-4 h-4 rounded-full bg-background z-10" />
                <div className="h-full border-l border-dashed border-border" />
              </div>

              {/* Right content */}
              <div className="w-[72%] p-3 flex flex-col justify-between">
                <div>
                  <p className={`font-bold text-sm leading-tight ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>
                    {v.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{v.condition}</p>
                  <div className="mt-1.5">
                    <CountdownBadge expDate={v.expDate} />
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <AnimatePresence mode="wait">
                    {justSaved ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600"
                      >
                        <Check className="w-3.5 h-3.5" /> Đã lưu!
                      </motion.span>
                    ) : saved ? (
                      <motion.button
                        key="use"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={handleUseNow}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" /> Dùng ngay
                      </motion.button>
                    ) : (
                      <motion.button
                        key="save"
                        initial={{ opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleSave(e, v.id)}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Lưu
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <VoucherDetailDrawer
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
      />
    </section>
  );
}
