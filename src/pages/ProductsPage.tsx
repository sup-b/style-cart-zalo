import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { categories, formatPrice } from '@/data/products';
import { Search, SearchX, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { vietnameseSearch } from '@/utils/stringUtils';
import { useDebounce } from '@/hooks/useDebounce';

const allSizes = ['S', 'M', 'L', 'XL'];

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState([0, 3000000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const allColors = useMemo(() => [...new Set(products.flatMap(p => p.colors.map(c => c.name)))], [products]);

  const filtered = products.filter(p => {
    if (debouncedSearch && !vietnameseSearch(p.nameVi, debouncedSearch) && !vietnameseSearch(p.name, debouncedSearch)) return false;
    if (category && p.category !== category) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedColors.length && !p.colors.some(c => selectedColors.includes(c.name))) return false;
    if (selectedSizes.length && !p.sizes.some(s => selectedSizes.includes(s))) return false;
    return true;
  });

  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleSize = (s: string) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const clearFilters = () => { setCategory(''); setPriceRange([0, 3000000]); setSelectedColors([]); setSelectedSizes([]); };
  const hasFilters = category || priceRange[0] > 0 || priceRange[1] < 3000000 || selectedColors.length || selectedSizes.length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm sản phẩm..."
              className="w-full rounded-none border border-border bg-background py-2.5 pl-10 pr-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground" />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative flex h-10 w-10 items-center justify-center border border-border">
                <SlidersHorizontal className="h-4 w-4" />
                {hasFilters && <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-foreground" />}
              </button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader><SheetTitle className="font-display text-xl">Bộ lọc</SheetTitle></SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="mb-3 text-xs font-body font-semibold uppercase tracking-widest">Khoảng giá</h4>
                  <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={3000000} step={100000} className="mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground font-body">
                    <span>{formatPrice(priceRange[0])}</span><span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 text-xs font-body font-semibold uppercase tracking-widest">Màu sắc</h4>
                  <div className="flex flex-wrap gap-2">
                    {allColors.map(c => (
                      <button key={c} onClick={() => toggleColor(c)}
                        className={`rounded-none border px-3 py-1.5 text-xs font-body transition-colors ${selectedColors.includes(c) ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 text-xs font-body font-semibold uppercase tracking-widest">Kích cỡ</h4>
                  <div className="flex gap-2">
                    {allSizes.map(s => (
                      <button key={s} onClick={() => toggleSize(s)}
                        className={`flex h-10 w-10 items-center justify-center border text-xs font-body font-medium transition-colors ${selectedSizes.includes(s) ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{s}</button>
                    ))}
                  </div>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground underline font-body"><X className="h-3 w-3" /> Xóa bộ lọc</button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setCategory('')}
            className={`shrink-0 rounded-none border px-4 py-1.5 text-xs font-body font-medium transition-colors ${!category ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>Tất cả</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`shrink-0 rounded-none border px-4 py-1.5 text-xs font-body font-medium transition-colors ${category === cat.id ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{cat.icon} {cat.name}</button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 p-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-lg" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 p-4">
            {filtered.map(p => <div key={p.id} className="relative"><ProductCard product={p} /></div>)}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-2">
              <SearchX className="h-10 w-10 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-muted-foreground font-body text-sm">
                {debouncedSearch
                  ? `Không tìm thấy kết quả phù hợp với "${debouncedSearch}".`
                  : 'Không tìm thấy sản phẩm phù hợp'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
