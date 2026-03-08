import { Search, Camera, ShoppingCart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export default function StorefrontHeader() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-shopee-header px-3 pb-2 pt-3 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="flex flex-1 items-center gap-2 rounded-sm bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent font-body text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="h-4 w-px bg-border" />
          <Camera className="h-4 w-4 text-primary" />
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative p-1">
          <ShoppingCart className="h-5 w-5 text-primary-foreground" />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-badge-red px-0.5 font-body text-[9px] font-bold text-primary-foreground animate-pulse-badge">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
          {totalItems === 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-badge-red px-0.5 font-body text-[9px] font-bold text-primary-foreground">
              3
            </span>
          )}
        </Link>

        {/* Chat */}
        <button className="relative p-1" onClick={() => window.open('https://zalo.me/', '_blank')}>
          <MessageCircle className="h-5 w-5 text-primary-foreground" />
        </button>
      </div>
    </header>
  );
}
