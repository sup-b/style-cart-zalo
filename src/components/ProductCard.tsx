import { Product, formatPrice } from '@/data/products';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useReviews, getAverageRating } from '@/hooks/useReviews';
import { InlineRating } from '@/components/ProductReviews';

export default function ProductCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(wishlisted ? 'Đã bỏ thích' : 'Đã thêm vào yêu thích', {
      icon: wishlisted ? '💔' : '❤️',
    });
  };

  return (
    <div className="group animate-fade-in relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.nameVi}
            className="h-full w-full object-cover img-hover"
            loading="lazy"
          />
          {product.originalPrice && (
            <span className="absolute left-2 top-2 bg-foreground px-2 py-0.5 text-[10px] font-body font-semibold uppercase tracking-widest text-background">
              Sale
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={handleToggleWishlist}
        className="absolute right-2 top-2 z-10 rounded-full bg-card/80 p-1.5 backdrop-blur-sm transition-colors"
        aria-label="Yêu thích"
      >
        <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
      </button>
      <div className="mt-3 space-y-1">
        <h3 className="font-display text-sm font-medium leading-tight tracking-wide">{product.nameVi}</h3>
        <p className="font-body text-[11px] uppercase tracking-widest text-muted-foreground">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="font-body text-sm font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="font-body text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        <div className="flex gap-1 pt-1">
          {product.colors.map(c => (
            <span key={c.name} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
          ))}
        </div>
      </div>
    </div>
  );
}