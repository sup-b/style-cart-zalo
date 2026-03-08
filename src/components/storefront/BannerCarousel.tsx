import { useState, useEffect, useCallback } from 'react';

const banners = [
  { id: 1, text: '🔥 SIÊU SALE 7.7', sub: 'Giảm đến 50% toàn bộ sản phẩm', bg: 'from-primary to-shopee-red' },
  { id: 2, text: '🚚 FREESHIP XTRA', sub: 'Miễn phí vận chuyển đơn từ 0Đ', bg: 'from-emerald-500 to-teal-600' },
  { id: 3, text: '💰 HOÀN XU 20%', sub: 'Mua sắm thả ga, nhận xu mỏi tay', bg: 'from-amber-500 to-orange-600' },
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(i => (i + 1) % banners.length), []);

  useEffect(() => {
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-36 w-full">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r ${banner.bg} px-6 text-center transition-all duration-500 ${
              idx === current ? 'translate-x-0 opacity-100' : idx < current ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0'
            }`}
          >
            <h2 className="font-body text-xl font-bold text-primary-foreground drop-shadow-md">{banner.text}</h2>
            <p className="mt-1 font-body text-xs text-primary-foreground/90">{banner.sub}</p>
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all ${idx === current ? 'w-5 bg-primary-foreground' : 'w-1.5 bg-primary-foreground/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
