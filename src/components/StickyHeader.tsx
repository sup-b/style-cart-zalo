import { useState, useEffect } from 'react';
import { Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

export default function StickyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 mx-auto max-w-md transition-all duration-300 ${
        scrolled
          ? 'bg-card/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-semibold tracking-wide shrink-0">
          <span className={scrolled ? 'text-foreground' : 'text-white'}>MAISON</span>
        </Link>

        {/* Search bar */}
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
            scrolled ? 'text-muted-foreground' : 'text-white/60'
          }`} strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Tìm kiếm bộ sưu tập mới..."
            className={`w-full rounded-md py-2 pl-9 pr-3 font-body text-xs transition-colors ${
              scrolled
                ? 'bg-secondary text-foreground placeholder:text-muted-foreground'
                : 'bg-white/15 text-white placeholder:text-white/50 backdrop-blur-sm'
            } border-0 outline-none focus:ring-1 focus:ring-foreground/20`}
          />
        </div>

        {/* Icons */}
        <Link to="/cart" className="relative shrink-0">
          <ShoppingBag className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} strokeWidth={1.5} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-warm text-[9px] font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
        <button
          onClick={() => window.open('https://zalo.me/', '_blank')}
          className="shrink-0"
        >
          <MessageCircle className={`h-5 w-5 ${scrolled ? 'text-foreground' : 'text-white'}`} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
