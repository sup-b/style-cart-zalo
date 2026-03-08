import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Flame } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { products, formatPrice } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function FlashSalePage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ h: 1, m: 45, s: 22 });

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

  const dealProducts = products.map(p => {
    const discount = p.originalPrice
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : Math.floor(Math.random() * 30) + 15;
    const soldPercent = Math.min(95, Math.round((p.sold / (p.sold + 30)) * 100));
    return { ...p, discount, soldPercent };
  });

  const handleBuy = (p: typeof dealProducts[0]) => {
    addItem(p, p.sizes[0] || 'M', p.colors[0]?.name || '', 1);
  };

  return (
    <div className="min-h-screen bg-[#1a0a0a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gradient-to-r from-[hsl(0,85%,25%)] to-[hsl(17,100%,40%)]">
        <div className="flex items-center gap-3 px-3 py-3">
          <button onClick={() => navigate(-1)} className="text-primary-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <Zap className="h-5 w-5 text-[hsl(var(--shopee-yellow))] fill-[hsl(var(--shopee-yellow))]" />
            <span className="font-body text-base font-bold uppercase tracking-wider text-primary-foreground">
              Deal Sốc
            </span>
          </div>
        </div>
      </div>

      {/* Banner + Countdown */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[hsl(0,85%,25%)] to-[#1a0a0a] px-4 pb-6 pt-2">
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-2">
            <Flame className="h-6 w-6 text-[hsl(var(--shopee-yellow))] animate-pulse" />
            <h1 className="font-display text-2xl font-bold text-[hsl(var(--shopee-yellow))] drop-shadow-[0_0_12px_hsl(45,100%,55%)]">
              DEAL SỐC GIỜ VÀNG
            </h1>
            <Flame className="h-6 w-6 text-[hsl(var(--shopee-yellow))] animate-pulse" />
          </div>
          <p className="mt-1 font-body text-[11px] text-primary-foreground/70">Kết thúc sau</p>

          {/* Countdown */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((v, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="rounded-md bg-primary-foreground px-2.5 py-1.5 font-body text-lg font-bold tabular-nums text-[hsl(0,85%,30%)] shadow-[0_0_10px_rgba(255,100,50,0.4)]">
                  {v}
                </span>
                {i < 2 && <span className="font-body text-lg font-bold text-[hsl(var(--shopee-yellow))]">:</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[hsl(17,100%,50%)] opacity-10 blur-2xl" />
        <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-[hsl(var(--shopee-yellow))] opacity-10 blur-2xl" />
      </div>

      {/* Product List */}
      <div className="space-y-3 px-3 pt-3">
        {dealProducts.map(p => {
          const urgencyLabel = p.soldPercent >= 85 ? 'Sắp cháy hàng!' : `Đã bán ${p.soldPercent}%`;

          return (
            <div key={p.id} className="flex gap-3 rounded-lg border border-[hsl(0,60%,20%)] bg-[#2a1010] p-2.5 shadow-lg">
              {/* Image */}
              <Link to={`/product/${p.id}`} className="relative w-28 shrink-0">
                <div className="aspect-square overflow-hidden rounded-md bg-[#3a1a1a]">
                  <img src={p.images[0]} alt={p.nameVi} className="h-full w-full object-cover" loading="lazy" />
                </div>
                {/* Discount badge */}
                <div className="absolute right-0 top-0 rounded-bl-md bg-[hsl(var(--shopee-red))] px-1.5 py-0.5">
                  <span className="font-body text-[10px] font-bold text-primary-foreground">-{p.discount}%</span>
                </div>
              </Link>

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between py-0.5">
                <div>
                  <Link to={`/product/${p.id}`}>
                    <h3 className="font-body text-sm font-medium leading-tight text-primary-foreground/90 line-clamp-2">
                      {p.nameVi}
                    </h3>
                  </Link>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-body text-lg font-bold text-primary">{formatPrice(p.price)}</span>
                    {p.originalPrice && (
                      <span className="font-body text-[11px] text-primary-foreground/40 line-through">
                        {formatPrice(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress + Buy */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1">
                    <div className="relative h-4 overflow-hidden rounded-full bg-[hsl(0,60%,20%)]">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${p.soldPercent}%`,
                          background: 'var(--shopee-gradient)',
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-body text-[9px] font-bold uppercase text-primary-foreground">
                        {p.soldPercent >= 85 && <Flame className="mr-0.5 inline h-2.5 w-2.5" />}
                        {urgencyLabel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuy(p)}
                    className="shrink-0 rounded-md bg-primary px-3 py-1.5 font-body text-[11px] font-bold text-primary-foreground shadow-[0_0_8px_hsl(17,100%,52%,0.4)] active:scale-95 transition-transform"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
