import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Ticket } from 'lucide-react';
import { useVoucher } from '@/context/VoucherContext';
import { toast } from 'sonner';
import { ALL_VOUCHERS } from '@/data/vouchers';
import VoucherDetailDrawer from '@/components/VoucherDetailDrawer';
import type { VoucherData } from '@/data/vouchers';

export default function VoucherSection() {
  const { saveVoucher, isVoucherSaved } = useVoucher();
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);

  const handleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    saveVoucher(id);
    toast.success('Đã lưu voucher thành công!');
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
          const isFreeship = v.type === 'freeship';

          return (
            <div
              key={v.id}
              onClick={() => setSelectedVoucher(v)}
              className="flex-shrink-0 w-64 flex rounded-lg border border-border bg-card shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className={`w-[30%] flex items-center justify-center ${isFreeship ? 'bg-blue-50' : 'bg-red-50'}`}>
                {isFreeship ? <Truck className="w-7 h-7 text-blue-500" /> : <Ticket className="w-7 h-7 text-red-500" />}
              </div>
              <div className="border-l border-dashed border-border" />
              <div className="w-[70%] p-3 flex flex-col justify-between">
                <div>
                  <p className={`font-bold text-sm ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>{v.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{v.condition}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">HSD: {v.expDate}</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    disabled={saved}
                    onClick={(e) => handleSave(e, v.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      saved ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {saved ? 'Đã lưu' : 'Lưu'}
                  </button>
                </div>
              </div>
            </div>
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
