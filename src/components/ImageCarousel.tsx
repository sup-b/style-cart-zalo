import { useState, useRef, useCallback } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: Props) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0 && current < images.length - 1) setCurrent(c => c + 1);
      if (delta > 0 && current > 0) setCurrent(c => c - 1);
    }
  }, [current, images.length]);

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden bg-secondary"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`${alt} ${idx + 1}`}
            className="h-full w-full shrink-0 object-cover"
            draggable={false}
          />
        ))}
      </div>

      {/* Pagination dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-6 bg-background'
                  : 'w-1.5 bg-background/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      <div className="absolute bottom-4 right-4 rounded-full bg-foreground/60 px-2.5 py-0.5 backdrop-blur-sm">
        <span className="font-body text-[10px] font-medium text-background">
          {current + 1}/{images.length}
        </span>
      </div>
    </div>
  );
}
