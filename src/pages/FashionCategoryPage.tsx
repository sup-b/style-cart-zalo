import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart, Heart } from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const subCategories = [
  { key: '', label: 'Tất cả' },
  { key: 'ao', label: 'Áo thun' },
  { key: 'vay', label: 'Váy đầm' },
  { key: 'quan', label: 'Quần Jeans' },
  { key: 'phukien', label: 'Phụ kiện' },
];

export default function FashionCategoryPage() {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const [search, setSearch] = useState('');
  const [activeSub, setActiveSub] = useState('');

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeSub && p.category !== activeSub) return false;
      if (search && !p.nameVi.toLowerCase().includes(search.toLowerCase()) && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activeSub, search]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-primary px-3 py-2.5 space-y-2">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex h-8 w-8 shrink-0 items-center justify-center text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm trong Thời trang nữ"
              className="w-full rounded-sm bg-card py-2 pl-8 pr-3 text-xs font-body placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <Link to="/cart" className="relative flex h-8 w-8 shrink-0 items-center justify-center text-primary-foreground">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sub-categories */}
      <div className="sticky top-[52px] z-40 bg-card border-b border-border px-3 py-2.5 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {subCategories.map(sub => (
            <button
              key={sub.key}
              onClick={() => setActiveSub(sub.key)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-body font-medium transition-colors ${
                activeSub === sub.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-foreground'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-2 p-2">
        {filtered.map(p => (
          <FashionCard key={p.id} product={p} />
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

function FashionCard({ product }: { product: typeof products[0] }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="relative overflow-hidden bg-card border border-border">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img src={product.images[0]} alt={product.nameVi} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
          {product.originalPrice && (
            <span className="absolute left-0 top-1.5 bg-destructive px-1.5 py-0.5 text-[10px] font-body font-bold text-destructive-foreground">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <div className="p-2 space-y-1.5">
          <h3 className="font-body text-xs leading-tight line-clamp-2 text-foreground min-h-[2rem]">{product.nameVi}</h3>
          {/* Size tags */}
          <div className="flex gap-1 flex-wrap">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="border border-border rounded px-1.5 py-0.5 text-[9px] font-body text-muted-foreground">{s}</span>
            ))}
          </div>
          <div className="flex items-end justify-between pt-0.5">
            <div className="space-y-0.5">
              <span className="font-body text-sm font-bold text-primary block">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="font-body text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            <span className="font-body text-[10px] text-muted-foreground">Đã bán {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-1.5 top-1.5 z-10 rounded-full bg-card/70 p-1.5 backdrop-blur-sm"
      >
        <Heart className={`h-3.5 w-3.5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
      </button>
    </div>
  );
}
