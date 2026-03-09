import { Truck, Coins, Shirt, Zap, Ticket, Gift, Tag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { LucideIcon } from 'lucide-react';

type QuickLink = {
  name: string;
  icon: LucideIcon;
  color: string;
};

const quickLinks: QuickLink[] = [
  { name: 'Freeship Xtra', icon: Truck, color: 'text-green-500' },
  { name: 'Hoàn xu', icon: Coins, color: 'text-amber-500' },
  { name: 'Thời trang nữ', icon: Shirt, color: 'text-pink-500' },
  { name: 'Deal sốc', icon: Zap, color: 'text-orange-600' },
  { name: 'Voucher', icon: Ticket, color: 'text-blue-500' },
  { name: 'Quà tặng', icon: Gift, color: 'text-purple-500' },
  { name: 'Đang giảm giá', icon: Tag, color: 'text-red-500' },
  { name: 'Hàng mới', icon: Sparkles, color: 'text-indigo-500' },
];

export default function QuickLinksMenu() {
  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {quickLinks.map(({ name, icon: Icon, color }) => (
          <button
            key={name}
            onClick={() => toast(`Đang mở tính năng ${name}`, { icon: '🚀' })}
            className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/50">
              <Icon className={`h-6 w-6 ${color}`} strokeWidth={1.5} />
            </div>
            <span className="w-full truncate text-center font-body text-[11px] text-muted-foreground">
              {name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
