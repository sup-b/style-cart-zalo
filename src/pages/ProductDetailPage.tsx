import { useParams, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/data/products';
import { useState, useEffect, useMemo } from 'react';
import ImageCarousel from '@/components/ImageCarousel';
import SizeGuideDialog from '@/components/SizeGuideDialog';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import {
  ArrowLeft, Heart, Minus, Plus, ShoppingBag, MessageCircle,
  Star, ChevronRight, ChevronDown, ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProduct } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { useReviews, getAverageRating } from '@/hooks/useReviews';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription,
} from '@/components/ui/drawer';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { addItem, totalItems } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  // Scroll listener for header
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Reviews
  const { data: reviews = [] } = useReviews(id || '');
  const { avg, count: reviewCount } = useMemo(() => getAverageRating(reviews), [reviews]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 space-y-4">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-3 p-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center font-body text-muted-foreground">
        Sản phẩm không tồn tại
      </div>
    );
  }

  const variant = product.variants.find(v => v.size === selectedSize && v.color === selectedColor);
  const inStock = variant ? variant.stock > 0 : true;
  const wishlisted = isWishlisted(product.id);

  const openVariantSheet = () => setDrawerOpen(true);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      openVariantSheet();
      toast.warning('Vui lòng chọn phân loại hàng');
      return;
    }
    if (!inStock) { toast.error('Sản phẩm đã hết hàng'); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    toast.success('Đã thêm vào giỏ hàng');
    setDrawerOpen(false);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      openVariantSheet();
      toast.warning('Vui lòng chọn phân loại hàng');
      return;
    }
    if (!inStock) { toast.error('Sản phẩm đã hết hàng'); return; }
    addItem(product, selectedSize, selectedColor, quantity);
    navigate('/cart');
  };

  // Mask reviewer name e.g. "hungdao" -> "H***o"
  const maskName = (name: string) => {
    if (name.length <= 2) return name[0] + '***';
    return name[0].toUpperCase() + '***' + name[name.length - 1];
  };

  const topReviews = reviews.slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Transparent sticky header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-background/60 backdrop-blur-md shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/cart')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-background/60 backdrop-blur-md shadow-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-background/60 backdrop-blur-md shadow-sm"
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? 'fill-destructive text-destructive' : ''}`} />
          </button>
        </div>
      </div>

      {/* Image gallery - full width, no padding */}
      <ImageCarousel images={product.images} alt={product.nameVi} />

      {/* Product info */}
      <div className="space-y-4 p-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-display text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="font-body text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <span className="rounded bg-destructive/10 px-1.5 py-0.5 font-body text-[10px] font-bold text-destructive">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Name */}
        <div>
          <h1 className="font-display text-lg font-semibold leading-tight">{product.nameVi}</h1>
          <p className="mt-0.5 font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.name}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4">
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-body text-sm font-semibold">{avg}</span>
              <span className="font-body text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}
          <span className="font-body text-xs text-muted-foreground">
            Đã bán {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}+
          </span>
        </div>

        {/* Variant selector trigger */}
        <button
          onClick={openVariantSheet}
          className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-secondary/50"
        >
          <span className="font-body text-sm text-muted-foreground">
            {selectedColor && selectedSize
              ? `${selectedColor}, ${selectedSize}`
              : 'Chọn Màu sắc, Kích thước'}
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Description - collapsible */}
        <div className="border-t border-border pt-4">
          <h3 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Mô tả sản phẩm
          </h3>
          <div className={`relative ${!descExpanded ? 'max-h-[4.5rem] overflow-hidden' : ''}`}>
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            {!descExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
            )}
          </div>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="mt-1 flex items-center gap-1 font-body text-xs font-medium text-primary"
          >
            {descExpanded ? (
              <><ChevronUp className="h-3 w-3" /> Thu gọn</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Xem thêm</>
            )}
          </button>
          <p className="mt-2 font-body text-xs text-muted-foreground">
            Chất liệu: <span className="font-medium text-foreground">{product.material}</span>
          </p>
        </div>

        {/* Reviews preview */}
        <div className="border-t border-border pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Đánh giá ({reviewCount})
            </h3>
            {reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="font-body text-sm font-bold">{avg}/5</span>
              </div>
            )}
          </div>

          {topReviews.length > 0 ? (
            <div className="space-y-3">
              {topReviews.map(r => (
                <div key={r.id} className="rounded-lg bg-secondary/40 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-body text-[10px] font-bold uppercase">
                      {r.display_name[0]}
                    </div>
                    <span className="font-body text-xs font-medium">{maskName(r.display_name)}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={10} className={r.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'} />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="mt-1.5 font-body text-xs leading-relaxed text-muted-foreground line-clamp-2">
                      {r.comment}
                    </p>
                  )}
                </div>
              ))}

              {reviewCount > 2 && (
                <button className="flex w-full items-center justify-center gap-1 py-2 font-body text-xs font-medium text-primary">
                  Xem tất cả {reviewCount} đánh giá
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <p className="font-body text-xs text-muted-foreground">
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </p>
          )}
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-stretch">
          {/* Chat icon */}
          <button
            className="flex w-[15%] items-center justify-center border-r border-border text-muted-foreground transition-colors hover:text-primary"
            onClick={() => toast.info('Tính năng chat đang được phát triển')}
          >
            <MessageCircle className="h-5 w-5" />
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="flex flex-1 items-center justify-center gap-2 border-r border-border py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary/50"
          >
            <ShoppingBag className="h-4 w-4" />
            Thêm vào giỏ
          </button>

          {/* Buy now */}
          <button
            onClick={handleBuyNow}
            className="flex flex-1 items-center justify-center gap-2 bg-foreground py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90"
          >
            Mua ngay
          </button>
        </div>
      </div>

      {/* Variant Bottom Sheet */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="pb-0">
            <DrawerTitle className="sr-only">Chọn phân loại</DrawerTitle>
            <DrawerDescription className="sr-only">Chọn màu sắc và kích thước</DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-6">
            {/* Product summary in sheet */}
            <div className="flex gap-3 pb-4 border-b border-border">
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                <img
                  src={product.images[0]}
                  alt={product.nameVi}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="font-body text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="mt-1 font-body text-xs text-muted-foreground">
                  {variant ? `Kho: ${variant.stock}` : `Kho: Chọn phân loại`}
                </span>
              </div>
            </div>

            {/* Colors */}
            <div className="mt-4">
              <h4 className="mb-2.5 font-body text-xs font-semibold uppercase tracking-widest">
                Màu sắc {selectedColor && <span className="normal-case tracking-normal text-muted-foreground">— {selectedColor}</span>}
              </h4>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      setSelectedSize(''); // reset size on color change
                    }}
                    className={`relative h-9 w-9 rounded-full border-2 transition-all ${
                      selectedColor === c.name
                        ? 'border-foreground scale-110 shadow-md'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  >
                    {selectedColor === c.name && (
                      <motion.div
                        layoutId="color-ring"
                        className="absolute -inset-1 rounded-full border-2 border-foreground"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-5">
              <div className="mb-2.5 flex items-center justify-between">
                <h4 className="font-body text-xs font-semibold uppercase tracking-widest">
                  Kích thước {selectedSize && <span className="normal-case tracking-normal text-muted-foreground">— {selectedSize}</span>}
                </h4>
                <SizeGuideDialog />
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => {
                  const v = selectedColor
                    ? product.variants.find(vr => vr.size === s && vr.color === selectedColor)
                    : null;
                  const outOfStock = v && v.stock === 0;
                  return (
                    <button
                      key={s}
                      onClick={() => !outOfStock && setSelectedSize(s)}
                      className={`flex h-10 min-w-[3.5rem] items-center justify-center rounded-lg border px-3 font-body text-sm font-medium transition-all ${
                        selectedSize === s
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border hover:border-foreground/40'
                      } ${outOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-5">
              <h4 className="mb-2.5 font-body text-xs font-semibold uppercase tracking-widest">Số lượng</h4>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-border transition-colors hover:bg-secondary"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <div className="flex h-10 w-12 items-center justify-center border-y border-border font-body text-sm font-medium">
                  {quantity}
                </div>
                <button
                  onClick={() => {
                    const max = variant?.stock ?? 99;
                    setQuantity(Math.min(max, quantity + 1));
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-border transition-colors hover:bg-secondary"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Sheet action buttons */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-foreground py-3 font-body text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-secondary"
              >
                <ShoppingBag className="h-4 w-4" />
                Thêm vào giỏ
              </button>
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-foreground py-3 font-body text-sm font-semibold uppercase tracking-wider text-background transition-opacity hover:opacity-90"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
