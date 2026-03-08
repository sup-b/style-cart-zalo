import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
      <img src={images[current]} alt={`${alt} ${current + 1}`} className="h-full w-full object-cover transition-opacity duration-300" />
      
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 p-1.5 backdrop-blur-sm">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-card/70 p-1.5 backdrop-blur-sm">
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === current ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/40'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
