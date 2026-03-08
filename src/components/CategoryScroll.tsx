import { Link } from 'react-router-dom';

const categoryItems = [
  { id: 'ao', name: 'Áo', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&q=80' },
  { id: 'quan', name: 'Quần', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&q=80' },
  { id: 'vay', name: 'Váy', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80' },
  { id: 'phukien', name: 'Phụ kiện', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80' },
  { id: 'new', name: 'Hàng mới', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80' },
];

export default function CategoryScroll() {
  return (
    <div className="px-4 py-6">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {categoryItems.map(cat => (
          <Link
            key={cat.id}
            to={cat.id === 'new' ? '/products' : `/products?category=${cat.id}`}
            className="shrink-0 group"
          >
            <div className="h-24 w-20 overflow-hidden rounded-lg bg-secondary">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-center font-body text-[11px] font-medium tracking-wide text-foreground">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
