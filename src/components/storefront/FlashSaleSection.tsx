import { useState, useEffect } from 'react';
import { Zap, ChevronRight } from 'lucide-react';
import { products, formatPrice } from '@/data/products';
import { Link } from 'react-router-dom';

export default function FlashSaleSection() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 15, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const saleProducts = products.filter(p => p.originalPrice).length > 0
    ? products.filter(p => p.originalPrice)
    : products.slice(0, 4);

  return (
    <div className="bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary fill-primary" />
          <span className="font-body text-sm font-bold uppercase tracking-wider text-primary">Flash Sale</span>
          {/* Countdown */}
          <div className="flex items-center gap-0.5">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((v, i) => (
              <span key={i} className="flex items-center">
                <span className="rounded-sm bg-foreground px-1.5 py-0.5 font-body text-[11px] font-bold text-card tabular-nums">{v}</span>
                {i < 2 && <span className="px-0.5 font-body text-xs font-bold text-foreground">:</span>}
              </span>
            ))}
          </div>
        </div>
        <Link to="/products" className="flex items-center gap-0.5 font-body text-xs text-primary">
          Xem tất cả <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Horizontal scroll products */}
      <div className="flex gap-2 overflow-x-auto px-3 pb-4 no-scrollbar">
        {saleProducts.map(p => {
          const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 30;
          const soldPercent = Math.min(95, Math.round((p.sold / (p.sold + 50)) * 100));

          return (
            <Link to={`/product/${p.id}`} key={p.id} className="w-28 shrink-0">
              <div className="relative aspect-square overflow-hidden rounded-t-sm bg-secondary">
                <img src={p.images[0]} alt={p.nameVi} className="h-full w-full object-cover" loading="lazy" />
                {/* Discount tag */}
                <div className="absolute right-0 top-0 bg-shopee-yellow/90 px-1.5 py-0.5">
                  <span className="font-body text-[10px] font-bold text-foreground">-{discount}%</span>
                </div>
              </div>
              <div className="space-y-1 rounded-b-sm border border-t-0 border-border bg-card p-2">
                <p className="font-body text-xs font-bold text-primary">{formatPrice(p.price)}</p>
                {/* Progress bar */}
                <div className="flash-progress">
                  <div className="flash-progress-bar" style={{ width: `${soldPercent}%` }} />
                  <span className="flash-progress-text">Đã bán {soldPercent}%</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
