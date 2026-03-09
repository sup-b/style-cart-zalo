import { useState, useMemo } from 'react';
import { formatPrice } from '@/data/products';
import { Shirt, Briefcase, Sparkles, Watch, ShoppingBag, Tag, Gem, Heart, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { mockProducts, filterByTag } from '@/data/mockData';
import ProductGrid from '@/components/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

type CategoryLink = {
  id: string;
  name: string;
  icon: LucideIcon;
  type: 'category' | 'tag' | 'sale';
  value: string;
};

const categoryLinks: CategoryLink[] = [
  { id: 'ao', name: 'Áo', icon: Shirt, type: 'category', value: 'ao' },
  { id: 'quan', name: 'Quần', icon: Briefcase, type: 'category', value: 'quan' },
  { id: 'vay', name: 'Váy đầm', icon: Sparkles, type: 'category', value: 'vay' },
  { id: 'phukien', name: 'Phụ kiện', icon: Watch, type: 'category', value: 'phukien' },
  { id: 'tuixach', name: 'Túi xách', icon: ShoppingBag, type: 'category', value: 'Túi xách' },
  { id: 'trangsuc', name: 'Trang sức', icon: Gem, type: 'category', value: 'Trang sức' },
  { id: 'new', name: 'Hàng mới', icon: Heart, type: 'tag', value: 'Hàng mới' },
  { id: 'sale', name: 'Khuyến mãi', icon: Tag, type: 'sale', value: 'sale' },
];

// Map mock category names to db category ids
const mockCategoryMap: Record<string, string> = {
  'Áo': 'ao',
  'Quần': 'quan',
  'Váy đầm': 'vay',
};

export default function CategoryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('ao');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dbProducts = [], isLoading } = useProducts();

  const activeCat = categoryLinks.find(c => c.id === activeCategory);

  // Search across all products
  const isSearching = searchQuery.trim().length > 0;
  const searchResults = useMemo(() => {
    if (!isSearching) return { db: [], mock: [] };
    const q = searchQuery.toLowerCase().trim();
    return {
      db: dbProducts.filter(p =>
        p.nameVi.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ),
      mock: mockProducts.filter(p => p.name.toLowerCase().includes(q)),
    };
  }, [searchQuery, dbProducts, isSearching]);

  // Get filtered DB products for category types
  const getDbProducts = () => {
    if (!activeCat) return [];
    if (activeCat.type === 'category') {
      return dbProducts.filter(p => p.category === activeCat.value);
    }
    return [];
  };

  // Get filtered mock products for tag/sale types
  const getMockProducts = () => {
    if (!activeCat) return [];
    if (activeCat.type === 'tag') {
      return filterByTag(mockProducts, activeCat.value as any);
    }
    if (activeCat.type === 'sale') {
      return mockProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    // For mock categories (túi xách, trang sức)
    if (activeCat.type === 'category' && !mockCategoryMap[activeCat.value]) {
      return mockProducts.filter(p => p.category === activeCat.value);
    }
    return [];
  };

  const dbFiltered = getDbProducts();
  const mockFiltered = getMockProducts();
  const usesMock = activeCat?.type === 'tag' || activeCat?.type === 'sale' ||
    (activeCat?.type === 'category' && ['Túi xách', 'Trang sức'].includes(activeCat.value));

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md px-4 py-3">
        <h1 className="font-display text-xl font-semibold">Danh mục</h1>
      </div>

      {/* Category Grid */}
      <div className="px-4 py-5">
        <div className="grid grid-cols-4 gap-x-2 gap-y-4">
          {categoryLinks.map(({ id, name, icon: Icon }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-full transition-colors ${
                  isActive
                    ? 'bg-foreground ring-2 ring-foreground/20'
                    : 'bg-[#f8f6f2]'
                }`}>
                  <Icon
                    className={`h-6 w-6 transition-colors ${isActive ? 'text-background' : 'text-foreground/70'}`}
                    strokeWidth={1.2}
                  />
                </div>
                <span className={`w-full truncate text-center font-body text-[11px] transition-colors ${
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border" />

      {/* Filtered Products */}
      <div className="pt-4">
        {isLoading && !usesMock ? (
          <div className="grid grid-cols-2 gap-3 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))}
          </div>
        ) : usesMock ? (
          <ProductGrid
            products={mockFiltered}
            title={activeCat?.name}
            emptyMessage={`Chưa có sản phẩm trong "${activeCat?.name}"`}
          />
        ) : (
          <div className="space-y-3 px-4">
            {activeCat && (
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">{activeCat.name}</h2>
                <span className="font-body text-xs text-muted-foreground">{dbFiltered.length} sản phẩm</span>
              </div>
            )}
            {dbFiltered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-body text-sm text-muted-foreground">Chưa có sản phẩm trong danh mục này</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {dbFiltered.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group animate-fade-in">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
                      <img
                        src={p.images[0]}
                        alt={p.nameVi}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {p.originalPrice && (
                        <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 font-body text-[9px] font-bold text-destructive-foreground">
                          -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2.5 space-y-1">
                      <p className="truncate font-body text-xs font-medium leading-tight">{p.nameVi}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm font-bold">{formatPrice(p.price)}</span>
                        {p.originalPrice && (
                          <span className="font-body text-[11px] text-muted-foreground line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {p.colors.slice(0, 4).map(c => (
                          <span key={c.name} className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
