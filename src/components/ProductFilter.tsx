import { useState } from 'react';
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả', min: 0, max: Infinity },
  { id: 'under500', label: 'Dưới 500K', min: 0, max: 500000 },
  { id: '500-1m', label: '500K - 1 triệu', min: 500000, max: 1000000 },
  { id: '1m-2m', label: '1 - 2 triệu', min: 1000000, max: 2000000 },
  { id: 'above2m', label: 'Trên 2 triệu', min: 2000000, max: Infinity },
];

const SIZES = ['S', 'M', 'L', 'XL', 'One Size'];

const COLORS = [
  { name: 'Đen', hex: '#1a1a1a' },
  { name: 'Trắng', hex: '#f5f0eb' },
  { name: 'Be', hex: '#d4c5a9' },
  { name: 'Nâu', hex: '#8b6f47' },
  { name: 'Hồng nhạt', hex: '#f0d4d4' },
  { name: 'Xám', hex: '#b0b0b0' },
];

export type ProductFilters = {
  priceRange: string;
  sizes: string[];
  colors: string[];
};

interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  activeCount: number;
}

export default function ProductFilter({ filters, onFiltersChange, activeCount }: ProductFilterProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalFilters(filters);
    }
    setOpen(isOpen);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const reset: ProductFilters = { priceRange: 'all', sizes: [], colors: [] };
    setLocalFilters(reset);
    onFiltersChange(reset);
    setOpen(false);
  };

  const toggleSize = (size: string) => {
    setLocalFilters(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setLocalFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color],
    }));
  };

  const filterCount = (filters.priceRange !== 'all' ? 1 : 0) + filters.sizes.length + filters.colors.length;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 font-body text-xs transition-colors active:bg-secondary/70">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>Bộ lọc</span>
          {filterCount > 0 && (
            <Badge className="h-4 min-w-4 rounded-full bg-foreground px-1 text-[10px] text-background">
              {filterCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl px-0">
        <SheetHeader className="px-4 pb-4 border-b border-border">
          <SheetTitle className="font-display text-lg">Bộ lọc sản phẩm</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <h3 className="font-body text-sm font-semibold">Khoảng giá</h3>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => setLocalFilters(prev => ({ ...prev, priceRange: range.id }))}
                  className={`rounded-full border px-3 py-1.5 font-body text-xs transition-colors ${
                    localFilters.priceRange === range.id
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border bg-background hover:border-foreground/50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <h3 className="font-body text-sm font-semibold">Kích thước</h3>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => {
                const selected = localFilters.sizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 font-body text-sm transition-colors ${
                      selected
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border bg-background hover:border-foreground/50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3">
            <h3 className="font-body text-sm font-semibold">Màu sắc</h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(color => {
                const selected = localFilters.colors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className={`relative h-10 w-10 rounded-full border-2 transition-all ${
                        selected ? 'border-foreground ring-2 ring-foreground/20' : 'border-border'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className={`h-4 w-4 ${color.hex === '#1a1a1a' ? 'text-white' : 'text-foreground'}`} strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                    <span className="font-body text-[10px] text-muted-foreground">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border px-4 py-4 flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-xl border border-border py-3 font-body text-sm font-medium transition-colors active:bg-secondary/50"
          >
            Đặt lại
          </button>
          <button
            onClick={handleApply}
            className="flex-1 rounded-xl bg-foreground py-3 font-body text-sm font-medium text-background transition-opacity active:opacity-80"
          >
            Áp dụng ({activeCount})
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Helper to apply filters to products
export function applyFilters<T extends { price: number; sizes?: string[]; colors?: { name: string }[]; variants?: { size: string; color: string }[] }>(
  products: T[],
  filters: ProductFilters
): T[] {
  let result = [...products];

  // Price filter
  if (filters.priceRange !== 'all') {
    const range = PRICE_RANGES.find(r => r.id === filters.priceRange);
    if (range) {
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
  }

  // Size filter
  if (filters.sizes.length > 0) {
    result = result.filter(p => {
      const productSizes = p.sizes || p.variants?.map(v => v.size) || [];
      return filters.sizes.some(s => productSizes.includes(s));
    });
  }

  // Color filter
  if (filters.colors.length > 0) {
    result = result.filter(p => {
      const productColors = p.colors?.map(c => c.name) || p.variants?.map(v => v.color) || [];
      return filters.colors.some(c => productColors.includes(c));
    });
  }

  return result;
}
