import { ArrowLeft, TicketPercent, Truck, Trash2, SearchX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { useVoucher } from '@/context/VoucherContext';
import { Button } from '@/components/ui/button';
import VoucherDetailDrawer from '@/components/VoucherDetailDrawer';
import type { VoucherData } from '@/data/vouchers';

export default function VoucherWalletPage() {
  const navigate = useNavigate();
  const { getSavedVouchers, removeVoucher } = useVoucher();
  const savedVouchers = getSavedVouchers();
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeVoucher(id);
    toast.success('Đã xóa voucher khỏi ví');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 bg-background border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-semibold text-foreground">Ví Voucher ({savedVouchers.length})</h1>
      </div>

      {savedVouchers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <SearchX className="w-16 h-16 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">Chưa có voucher nào</p>
          <p className="text-xs text-muted-foreground mb-5">Hãy khám phá và lưu mã giảm giá từ trang chủ</p>
          <Button size="sm" onClick={() => navigate('/')}>Khám phá ngay</Button>
        </div>
      ) : (
        <div className="p-4 space-y-3 pb-24">
          {savedVouchers.map((v) => {
            const isFreeship = v.type === 'freeship';
            return (
              <div
                key={v.id}
                onClick={() => setSelectedVoucher(v)}
                className="flex rounded-xl border border-border bg-card shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
              >
                {/* Left icon */}
                <div className={`flex items-center justify-center w-20 shrink-0 ${isFreeship ? 'bg-blue-50' : 'bg-red-50'}`}>
                  {isFreeship ? (
                    <Truck className="w-7 h-7 text-blue-500" />
                  ) : (
                    <TicketPercent className="w-7 h-7 text-red-500" />
                  )}
                </div>

                {/* Dashed divider */}
                <div className="border-l border-dashed border-border" />

                {/* Content */}
                <div className="flex-1 p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>{v.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{v.condition}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">HSD: {v.expDate}</p>
                  </div>
                  <button
                    onClick={(e) => handleRemove(e, v.id)}
                    className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VoucherDetailDrawer
        isOpen={!!selectedVoucher}
        onClose={() => setSelectedVoucher(null)}
        voucher={selectedVoucher}
      />
    </div>
  );
}
