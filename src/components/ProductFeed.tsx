import { formatPrice } from '@/data/products';
import { Heart, Plus } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/data/products';

export default function ProductFeed() {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { data: products, isLoading } = useProducts();

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0], product.colors[0].name, 1);
    toast.success('Đã thêm vào giỏ hàng');
  };

  const formatSold = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="mb-4"><Skeleton className="h-8 w-48" /></div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="font-display text-2xl font-semibold tracking-wide">Gợi ý cho bạn</h2>
        <Link to="/products" className="font-body text-[11px] uppercase tracking-widest text-muted-foreground">Tất cả</Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {(products || []).map(product => {
          const wishlisted = isWishlisted(product.id);
          return (
            <Link key={product.id} to={`/product/${product.id}`} className="group animate-fade-in">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                <img src={product.images[0]} alt={product.nameVi} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }} className="absolute top-2 right-2 z-10 rounded-full bg-card/70 p-1.5 backdrop-blur-sm transition-colors" aria-label="Yêu thích">
                  <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-accent-warm text-accent-warm' : 'text-foreground/60'}`} strokeWidth={1.5} />
                </button>
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-foreground text-background px-1.5 py-0.5 font-body text-[9px] font-bold rounded-sm">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                <button onClick={(e) => handleQuickAdd(e, product)} className="absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-110" aria-label="Thêm vào giỏ">
                  <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <div className="mt-2.5 space-y-1">
                <p className="font-body text-xs font-medium leading-tight truncate">{product.nameVi}</p>
                <p className="font-body text-sm font-bold text-accent-warm">{formatPrice(product.price)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {product.colors.slice(0, 4).map(c => (
                      <span key={c.name} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <span className="font-body text-[10px] text-muted-foreground">Đã bán {formatSold(product.sold)}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
