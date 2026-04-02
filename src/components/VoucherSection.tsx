import { Truck, Ticket } from 'lucide-react';
import { useVoucher } from '@/context/VoucherContext';
import { toast } from 'sonner';

type Voucher = {
  id: string;
  title: string;
  condition: string;
  type: 'freeship' | 'discount';
  expDate: string;
};

const homeVouchers: Voucher[] = [
  { id: 'v1', title: 'Freeship', condition: 'Đơn tối thiểu 99K', type: 'freeship', expDate: '30/04/2026' },
  { id: 'v2', title: 'Giảm 20K', condition: 'Đơn tối thiểu 150K', type: 'discount', expDate: '15/05/2026' },
  { id: 'v3', title: 'Giảm 50K', condition: 'Đơn tối thiểu 350K', type: 'discount', expDate: '20/05/2026' },
  { id: 'v4', title: 'Freeship Extra', condition: 'Đơn tối thiểu 200K', type: 'freeship', expDate: '10/06/2026' },
];

export default function VoucherSection() {
  const { saveVoucher, isVoucherSaved } = useVoucher();

  const handleSave = (id: string) => {
    saveVoucher(id);
    toast.success('Đã lưu voucher thành công!');
  };

  return (
    <section className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-base text-foreground">Mã giảm giá cho bạn</h2>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          Xem tất cả &gt;
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {homeVouchers.map((v) => {
          const saved = isVoucherSaved(v.id);
          const isFreeship = v.type === 'freeship';

          return (
            <div
              key={v.id}
              className="flex-shrink-0 w-64 flex rounded-lg border border-border bg-card shadow-sm overflow-hidden"
            >
              {/* Left icon section */}
              <div
                className={`w-[30%] flex items-center justify-center ${
                  isFreeship ? 'bg-blue-50' : 'bg-red-50'
                }`}
              >
                {isFreeship ? (
                  <Truck className={`w-7 h-7 text-blue-500`} />
                ) : (
                  <Ticket className={`w-7 h-7 text-red-500`} />
                )}
              </div>

              {/* Dashed divider */}
              <div className="border-l border-dashed border-border" />

              {/* Right content */}
              <div className="w-[70%] p-3 flex flex-col justify-between">
                <div>
                  <p className={`font-bold text-sm ${isFreeship ? 'text-blue-600' : 'text-red-600'}`}>
                    {v.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{v.condition}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">HSD: {v.expDate}</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    disabled={saved}
                    onClick={() => handleSave(v.id)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      saved
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
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
    </section>
  );
}
