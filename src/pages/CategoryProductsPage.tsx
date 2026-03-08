import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Gift } from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';

const CATEGORY_CONFIG: Record<string, { title: string; filter: (p: typeof products[0]) => boolean; sort?: (a: typeof products[0], b: typeof products[0]) => number }> = {
  freeship: {
    title: 'Freeship Xtra',
    filter: (p) => !!p.isFreeship,
  },
  cashback: {
    title: 'Hoàn xu',
    filter: (p) => !!p.hasCoinCashback,
  },
  sale: {
    title: 'Đang giảm giá',
    filter: (p) => !!p.originalPrice && p.originalPrice > p.price,
  },
  new: {
    title: 'Hàng mới',
    filter: () => true,
    sort: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  },
  gift: {
    title: 'Quà tặng',
    filter: (p) => !!p.hasGift,
  },
  deal: {
    title: 'Deal sốc',
    filter: (p) => !!p.originalPrice && p.originalPrice > p.price,
  },
};

type SortMode = 'popular' | 'best-selling' | 'price-asc' | 'price-desc';

export default function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [sortMode, setSortMode] = useState<SortMode>('popular');

  const config = CATEGORY_CONFIG[slug || ''] || { title: 'Sản phẩm', filter: () => true };

  const filtered = useMemo(() => {
    let list = products.filter(config.filter);
    if (config.sort) list = [...list].sort(config.sort);

    switch (sortMode) {
      case 'best-selling':
        return [...list].sort((a, b) => b.sold - a.sold);
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [slug, sortMode]);

  const togglePriceSort = () => {
    setSortMode(prev => prev === 'price-asc' ? 'price-desc' : 'price-asc');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 bg-primary px-3 py-3">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center text-primary-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="flex-1 text-center font-display text-base font-semibold text-primary-foreground">{config.title}</h1>
        <div className="w-8" />
      </div>

      {/* Sort bar */}
      <div className="sticky top-[52px] z-40 flex border-b border-border bg-card">
        {[
          { key: 'popular' as SortMode, label: 'Phổ biến' },
          { key: 'best-selling' as SortMode, label: 'Bán chạy' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSortMode(tab.key)}
            className={`flex-1 py-2.5 text-xs font-body font-medium transition-colors ${sortMode === tab.key ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={togglePriceSort}
          className={`flex flex-1 items-center justify-center gap-0.5 py-2.5 text-xs font-body font-medium transition-colors ${sortMode.startsWith('price') ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
        >
          Giá
          <span className="flex flex-col -space-y-1">
            <ChevronUp className={`h-3 w-3 ${sortMode === 'price-asc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
            <ChevronDown className={`h-3 w-3 ${sortMode === 'price-desc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
          </span>
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2 p-2">
        {filtered.map(p => (
          <CategoryProductCard key={p.id} product={p} showGift={slug === 'gift'} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground font-body text-sm">Không tìm thấy sản phẩm</p>
        </div>
      )}
    </div>
  );
}

function CategoryProductCard({ product, showGift }: { product: typeof products[0]; showGift?: boolean }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="relative overflow-hidden bg-card border border-border">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img src={product.images[0]} alt={product.nameVi} className="h-full w-full object-cover" loading="lazy" />
          {product.originalPrice && (
            <span className="absolute left-0 top-1 bg-destructive px-1.5 py-0.5 text-[10px] font-body font-bold text-destructive-foreground">
              -{discount}%
            </span>
          )}
          {product.isFreeship && (
            <span className="absolute right-0 bottom-0 bg-emerald-500 px-1.5 py-0.5 text-[9px] font-body font-semibold text-white">
              Freeship
            </span>
          )}
        </div>
        <div className="p-2 space-y-1">
          <h3 className="font-body text-xs leading-tight line-clamp-2 text-foreground">{product.nameVi}</h3>
          <div className="flex items-end justify-between">
            <span className="font-body text-sm font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="font-body text-[10px] text-muted-foreground">Đã bán {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
          </div>
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-1.5 top-1.5 z-10 rounded-full bg-card/70 p-1 backdrop-blur-sm"
      >
        <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
      </button>

      {showGift && (
        <div className="absolute left-1.5 bottom-14 z-10 animate-bounce">
          <Gift className="h-5 w-5 text-destructive drop-shadow-md" />
        </div>
      )}
    </div>
  );
}
