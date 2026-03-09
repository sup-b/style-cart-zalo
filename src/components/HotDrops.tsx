import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  function getTimeLeft(target: Date) {
    const diff = Math.max(0, target.getTime() - Date.now());
    return { hours: Math.floor(diff / (1000 * 60 * 60)), minutes: Math.floor((diff / (1000 * 60)) % 60), seconds: Math.floor((diff / 1000) % 60) };
  }
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}

export default function HotDrops() {
  const target = new Date();
  target.setHours(23, 59, 59, 999);
  const { hours, minutes, seconds } = useCountdown(target);
  const { data: products } = useProducts();

  const saleItems = (products || []).filter(p => p.originalPrice).concat((products || []).slice(0, 2));
  const pad = (n: number) => String(n).padStart(2, '0');

  if (!saleItems.length) return null;

  return (
    <div className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-wide">Hot Drops</h2>
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">Weekly Best</p>
        </div>
        <div className="flex items-center gap-1">
          {[pad(hours), pad(minutes), pad(seconds)].map((val, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-foreground text-background font-body text-xs font-bold px-1.5 py-1 rounded-sm min-w-[28px] text-center">{val}</span>
              {i < 2 && <span className="text-foreground font-bold text-xs">:</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {saleItems.map((product, idx) => {
          const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
          return (
            <Link key={`${product.id}-${idx}`} to={`/product/${product.id}`} className="shrink-0 w-36 group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
                <img src={product.images[0]} alt={product.nameVi} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                {discount && <span className="absolute top-2 left-2 bg-foreground text-background px-1.5 py-0.5 font-body text-[10px] font-bold rounded-sm">-{discount}%</span>}
              </div>
              <div className="mt-2 space-y-0.5">
                <p className="font-body text-xs font-medium leading-tight truncate">{product.nameVi}</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-body text-xs font-bold text-accent-warm">{formatPrice(product.price)}</span>
                  {product.originalPrice && <span className="font-body text-[10px] text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
