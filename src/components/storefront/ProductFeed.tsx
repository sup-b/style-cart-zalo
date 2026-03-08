import { products, formatPrice } from '@/data/products';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { Star } from 'lucide-react';

const feedProducts = [...products, ...products].map((p, i) => ({ ...p, _key: `${p.id}-${i}` }));

export default function ProductFeed() {
  return (
    <div className="bg-background">
      {/* Sticky tab header */}
      <div className="sticky top-[52px] z-40 flex items-center justify-center border-b-2 border-primary bg-card py-2.5">
        <span className="font-body text-sm font-bold uppercase tracking-widest text-primary">Gợi ý hôm nay</span>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-2 gap-1 p-1">
        {feedProducts.map((p) => (
          <ProductFeedCard key={p._key} product={p} />
        ))}
      </div>
    </div>
  );
}

function ProductFeedCard({ product }: { product: typeof products[0] & { _key: string } }) {
  const { isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const isMall = product.price > 1000000;
  const soldText = product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold.toString();

  return (
    <Link to={`/product/${product.id}`} className="block overflow-hidden bg-card">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img src={product.images[0]} alt={product.nameVi} className="h-full w-full object-cover" loading="lazy" />
        {/* Tags */}
        <div className="absolute left-0 top-0 flex flex-col gap-0.5">
          {isMall && (
            <span className="bg-primary px-1.5 py-0.5 font-body text-[8px] font-bold uppercase text-primary-foreground">Mall</span>
          )}
          {wishlisted && (
            <span className="bg-shopee-red px-1.5 py-0.5 font-body text-[8px] font-bold text-primary-foreground">Yêu thích</span>
          )}
        </div>
        {product.originalPrice && (
          <div className="absolute right-0 top-0 bg-shopee-yellow/90 px-1.5 py-0.5">
            <span className="font-body text-[9px] font-bold text-foreground">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1.5 p-2">
        {/* Name - max 2 lines */}
        <h3 className="font-body text-xs leading-tight text-foreground line-clamp-2">{product.nameVi}</h3>

        {/* Sub tags */}
        <div className="flex flex-wrap gap-1">
          <span className="rounded-sm border border-primary/30 bg-accent px-1 py-0.5 font-body text-[8px] font-medium text-accent-foreground">
            Freeship Xtra
          </span>
          {product.originalPrice && (
            <span className="rounded-sm border border-primary/30 bg-accent px-1 py-0.5 font-body text-[8px] font-medium text-accent-foreground">
              Đang giảm giá
            </span>
          )}
        </div>

        {/* Price + sold */}
        <div className="flex items-end justify-between">
          <span className="font-body text-sm font-bold text-primary">{formatPrice(product.price)}</span>
          <span className="font-body text-[10px] text-muted-foreground">Đã bán {soldText}</span>
        </div>
      </div>
    </Link>
  );
}
