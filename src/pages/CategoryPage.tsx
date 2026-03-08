import { useState } from 'react';
import { categories, products, formatPrice } from '@/data/products';
import { Shirt, Briefcase, Sparkles, Watch, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  'Áo': Shirt,
  'Quần': Briefcase,
  'Váy': Sparkles,
  'Phụ kiện': Watch,
};

const getIcon = (name: string): LucideIcon => iconMap[name] || ShoppingBag;

export default function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const selectedCat = categories.find(c => c.id === selectedCategory);
  const filteredProducts = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : [];

  if (selectedCategory && selectedCat) {
    const Icon = getIcon(selectedCat.name);
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-background/95 backdrop-blur-md px-4 py-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <h1 className="font-display text-lg font-semibold">{selectedCat.name}</h1>
          </div>
          <span className="ml-auto font-body text-xs text-muted-foreground">
            {filteredProducts.length} sản phẩm
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {filteredProducts.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="group animate-fade-in"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                <img
                  src={p.images[0]}
                  alt={p.nameVi}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {p.originalPrice && (
                  <span className="absolute left-2 top-2 rounded-sm bg-foreground px-1.5 py-0.5 font-body text-[9px] font-bold text-background">
                    -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="mt-2.5 space-y-1">
                <p className="truncate font-body text-xs font-medium leading-tight">{p.nameVi}</p>
                <p className="font-body text-sm font-bold text-accent-warm">{formatPrice(p.price)}</p>
                <div className="flex gap-1">
                  {p.colors.slice(0, 4).map(c => (
                    <span
                      key={c.name}
                      className="h-3 w-3 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-muted-foreground">Chưa có sản phẩm trong danh mục này</p>
          </div>
        )}
      </div>
    );
  }

  // Category list view
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md px-4 py-3">
        <h1 className="font-display text-xl font-semibold">Danh mục</h1>
      </div>

      <div className="space-y-2 p-4">
        {categories.map(cat => {
          const Icon = getIcon(cat.name);
          const count = products.filter(p => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors active:bg-secondary"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Icon className="h-5 w-5 text-foreground/70" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="font-body text-sm font-semibold">{cat.name}</p>
                <p className="font-body text-[11px] text-muted-foreground">{count} sản phẩm</p>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50" strokeWidth={1.5} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
