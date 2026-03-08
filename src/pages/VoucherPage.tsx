import { useState } from 'react';
import { ArrowLeft, Truck, Coins, Store, Ticket, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type VoucherType = 'freeship' | 'shop' | 'cashback';

interface Voucher {
  id: string;
  type: VoucherType;
  title: string;
  condition: string;
  expiry: string;
}

const VOUCHERS: Voucher[] = [
  { id: '1', type: 'freeship', title: 'Miễn phí vận chuyển', condition: 'Đơn tối thiểu 0Đ', expiry: '15.03.2026' },
  { id: '2', type: 'shop', title: 'Giảm 20K', condition: 'Đơn tối thiểu 150K', expiry: '20.03.2026' },
  { id: '3', type: 'cashback', title: 'Hoàn 10% xu', condition: 'Đơn tối thiểu 200K', expiry: '18.03.2026' },
  { id: '4', type: 'freeship', title: 'Giảm 15K phí ship', condition: 'Đơn tối thiểu 50K', expiry: '25.03.2026' },
  { id: '5', type: 'shop', title: 'Giảm 50K', condition: 'Đơn tối thiểu 500K', expiry: '12.03.2026' },
  { id: '6', type: 'cashback', title: 'Hoàn 5% xu', condition: 'Đơn tối thiểu 100K', expiry: '30.03.2026' },
  { id: '7', type: 'shop', title: 'Giảm 100K', condition: 'Đơn tối thiểu 1 triệu', expiry: '10.04.2026' },
  { id: '8', type: 'freeship', title: 'Freeship đơn từ 99K', condition: 'Đơn tối thiểu 99K', expiry: '22.03.2026' },
];

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'freeship', label: 'Freeship' },
  { key: 'shop', label: 'Shop' },
  { key: 'cashback', label: 'Hoàn xu' },
] as const;

const TYPE_CONFIG: Record<VoucherType, { icon: typeof Truck; bg: string; accent: string }> = {
  freeship: { icon: Truck, bg: 'bg-emerald-500/15', accent: 'text-emerald-500' },
  shop: { icon: Tag, bg: 'bg-primary/15', accent: 'text-primary' },
  cashback: { icon: Coins, bg: 'bg-amber-500/15', accent: 'text-amber-500' },
};

export default function VoucherPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = activeTab === 'all' ? VOUCHERS : VOUCHERS.filter(v => v.type === activeTab);

  const handleSave = (id: string) => {
    setSaved(prev => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card border-b border-border">
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={() => navigate(-1)} className="text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <Ticket className="h-5 w-5 text-primary" />
          <h1 className="font-body text-base font-bold text-foreground">Kho Voucher</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 pb-2.5 no-scrollbar overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Voucher List */}
      <div className="space-y-3 px-3 pt-3">
        {filtered.map(voucher => {
          const config = TYPE_CONFIG[voucher.type];
          const Icon = config.icon;
          const isSaved = saved.has(voucher.id);

          return (
            <div
              key={voucher.id}
              className="flex overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              {/* Left - icon section with ticket notch */}
              <div className={`relative flex w-[30%] shrink-0 items-center justify-center ${config.bg}`}>
                <Icon className={`h-8 w-8 ${config.accent}`} />
                {/* Ticket notches */}
                <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-0">
                  <div className="h-5 w-5 rounded-full bg-background" />
                </div>
              </div>

              {/* Right - info section */}
              <div className="flex flex-1 items-center justify-between gap-2 border-l border-dashed border-border py-3 pl-4 pr-3">
                <div className="min-w-0">
                  <p className="font-body text-sm font-bold text-foreground truncate">{voucher.title}</p>
                  <p className="mt-0.5 font-body text-[11px] text-muted-foreground">{voucher.condition}</p>
                  <p className="mt-1 font-body text-[10px] text-muted-foreground/70">HSD: {voucher.expiry}</p>
                </div>
                <button
                  onClick={() => !isSaved && handleSave(voucher.id)}
                  disabled={isSaved}
                  className={`shrink-0 rounded-md px-3 py-1.5 font-body text-[11px] font-bold transition-colors ${
                    isSaved
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground active:scale-95'
                  }`}
                >
                  {isSaved ? 'Đã lưu' : 'Lưu'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
