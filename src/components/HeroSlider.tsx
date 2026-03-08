import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    subtitle: 'Bộ sưu tập mới',
    title: 'Xuân Hè\n2026',
  },
  {
    image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&q=80',
    subtitle: 'Editorial',
    title: 'Minimal\nElegance',
  },
  {
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    subtitle: 'Lookbook',
    title: 'Phong cách\nđương đại',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

      {/* Content */}
      <div className="absolute bottom-20 left-6 right-6 animate-slide-up">
        <p className="font-body text-[10px] uppercase tracking-[0.4em] text-white/70">
          {slides[current].subtitle}
        </p>
        <h1 className="mt-1 font-display text-5xl font-light leading-[1.1] text-white whitespace-pre-line">
          {slides[current].title}
        </h1>
        <Link
          to="/products"
          className="mt-6 inline-block border border-white/40 bg-white/10 px-8 py-3 font-body text-[11px] font-medium uppercase tracking-[0.25em] text-white backdrop-blur-sm transition-all hover:bg-white hover:text-foreground"
        >
          Khám phá ngay
        </Link>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-6 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-500 ${
              idx === current ? 'w-8 bg-white' : 'w-4 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
