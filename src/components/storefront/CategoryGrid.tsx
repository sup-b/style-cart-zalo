import { Truck, Coins, ShirtIcon, Zap, Ticket, Gift, Tag, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  { icon: Truck, label: 'Freeship Xtra', color: 'text-emerald-500', path: '/category/freeship' },
  { icon: Coins, label: 'Hoàn xu', color: 'text-amber-500', path: '/category/cashback' },
  { icon: ShirtIcon, label: 'Thời trang nữ', color: 'text-pink-500', path: '/fashion' },
  { icon: Zap, label: 'Deal sốc', color: 'text-primary', path: '/category/deal' },
  { icon: Ticket, label: 'Voucher', color: 'text-blue-500', path: '/products' },
  { icon: Gift, label: 'Quà tặng', color: 'text-purple-500', path: '/category/gift' },
  { icon: Tag, label: 'Đang giảm giá', color: 'text-red-500', path: '/category/sale' },
  { icon: Sparkles, label: 'Hàng mới', color: 'text-indigo-500', path: '/category/new' },
];

export default function CategoryGrid() {
  return (
    <div className="bg-card px-2 py-4">
      <div className="grid grid-cols-4 gap-y-4">
        {categories.map((cat, i) => (
          <Link key={i} to={cat.path} className="flex flex-col items-center gap-1.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
              <cat.icon className={`h-5 w-5 ${cat.color}`} />
            </div>
            <span className="font-body text-[10px] leading-tight text-foreground text-center">{cat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
