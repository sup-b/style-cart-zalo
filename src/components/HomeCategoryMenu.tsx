import { Shirt, Watch, ShoppingBag, Tag, Sparkles, Icon } from 'lucide-react';
import { trousers, dress, gemRing } from '@lucide/lab';
import { Link } from 'react-router-dom';
import type { LucideIcon, IconNode } from 'lucide-react';

type CategoryLink = {
  id: string;
  name: string;
  icon?: LucideIcon;
  labIcon?: IconNode;
  href: string;
};

const categoryLinks: CategoryLink[] = [
  { id: 'ao', name: 'Áo', icon: Shirt, href: '/categories?cat=ao' },
  { id: 'quan', name: 'Quần', labIcon: trousers, href: '/categories?cat=quan' },
  { id: 'vay', name: 'Váy đầm', labIcon: dress, href: '/categories?cat=vay' },
  { id: 'phukien', name: 'Phụ kiện', icon: Watch, href: '/categories?cat=phukien' },
  { id: 'tuixach', name: 'Túi xách', icon: ShoppingBag, href: '/categories?cat=phukien' },
  { id: 'trangsuc', name: 'Trang sức', labIcon: gemRing, href: '/categories?cat=phukien' },
  { id: 'new', name: 'Hàng mới', icon: Sparkles, href: '/products?filter=new' },
  { id: 'sale', name: 'Khuyến mãi', icon: Tag, href: '/products?filter=sale' },
];

export default function HomeCategoryMenu() {
  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-4 gap-y-4">
        {categoryLinks.map(({ id, name, icon: RegularIcon, labIcon, href }) => (
          <Link
            key={id}
            to={href}
            className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              {labIcon ? (
                <Icon iconNode={labIcon} className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
              ) : RegularIcon ? (
                <RegularIcon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
              ) : null}
            </div>
            <span className="w-full truncate text-center font-body text-xs text-muted-foreground">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
