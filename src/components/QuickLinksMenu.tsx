import { Truck, Coins, Shirt, Zap, Ticket, Gift, Tag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type QuickLink = {
  name: string;
  icon: LucideIcon;
  color: string;
  route: string | null; // null = toast only
};

const quickLinks: QuickLink[] = [
  { name: 'Freeship Xtra', icon: Truck, color: 'text-green-500', route: '/collection/freeship' },
  { name: 'Hoàn xu', icon: Coins, color: 'text-amber-500', route: '/collection/hoan-xu' },
  { name: 'Thời trang nữ', icon: Shirt, color: 'text-pink-500', route: '/collection/thoi-trang-nu' },
  { name: 'Deal sốc', icon: Zap, color: 'text-orange-600', route: '/collection/deal-soc' },
  { name: 'Voucher', icon: Ticket, color: 'text-blue-500', route: '/vouchers' },
  { name: 'Quà tặng', icon: Gift, color: 'text-purple-500', route: '/collection/qua-tang' },
  { name: 'Đang giảm giá', icon: Tag, color: 'text-red-500', route: '/collection/dang-giam-gia' },
  { name: 'Hàng mới', icon: Sparkles, color: 'text-indigo-500', route: '/collection/hang-moi' },
];

export default function QuickLinksMenu() {
  const navigate = useNavigate();

  const handleClick = (link: QuickLink) => {
    if (link.route) {
      navigate(link.route);
    }
  };

  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-4 gap-x-2 gap-y-4">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.name}
              onClick={() => handleClick(link)}
              className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/50">
                <Icon className={`h-6 w-6 ${link.color}`} strokeWidth={1.5} />
              </div>
              <span className="w-full truncate text-center font-body text-[11px] text-muted-foreground">
                {link.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
