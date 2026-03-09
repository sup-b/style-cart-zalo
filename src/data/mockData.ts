// Product categories
export const CATEGORIES = [
  'Áo',
  'Quần', 
  'Váy đầm',
  'Phụ kiện',
  'Túi xách',
  'Trang sức',
] as const;

export type ProductCategory = typeof CATEGORIES[number];

// Promotion tags
export const TAGS = [
  'Freeship',
  'Hoàn xu',
  'Deal Sốc',
  'Hàng mới',
  'Quà tặng',
] as const;

export type ProductTag = typeof TAGS[number];

// Product interface
export interface MockProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  tags: ProductTag[];
}

// Mock products data
export const mockProducts: MockProduct[] = [
  {
    id: 'mock-1',
    name: 'Áo Thun Basic Oversize',
    price: 299000,
    originalPrice: 450000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=533&fit=crop',
    category: 'Áo',
    tags: ['Deal Sốc', 'Freeship'],
  },
  {
    id: 'mock-2',
    name: 'Áo Sơ Mi Lụa Cao Cấp',
    price: 590000,
    image: 'https://images.unsplash.com/photo-1598032895455-1c074e1e5dce?w=400&h=533&fit=crop',
    category: 'Áo',
    tags: ['Hàng mới', 'Hoàn xu'],
  },
  {
    id: 'mock-3',
    name: 'Quần Jeans Ống Rộng',
    price: 650000,
    originalPrice: 890000,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=533&fit=crop',
    category: 'Quần',
    tags: ['Deal Sốc', 'Freeship'],
  },
  {
    id: 'mock-4',
    name: 'Quần Tây Công Sở',
    price: 490000,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=533&fit=crop',
    category: 'Quần',
    tags: ['Hoàn xu'],
  },
  {
    id: 'mock-5',
    name: 'Váy Midi Hoa Nhí',
    price: 750000,
    originalPrice: 950000,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=533&fit=crop',
    category: 'Váy đầm',
    tags: ['Deal Sốc', 'Quà tặng'],
  },
  {
    id: 'mock-6',
    name: 'Đầm Dự Tiệc Satin',
    price: 1290000,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=533&fit=crop',
    category: 'Váy đầm',
    tags: ['Hàng mới', 'Freeship'],
  },
  {
    id: 'mock-7',
    name: 'Túi Xách Mini Đeo Chéo',
    price: 890000,
    originalPrice: 1190000,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=533&fit=crop',
    category: 'Túi xách',
    tags: ['Deal Sốc', 'Hoàn xu'],
  },
  {
    id: 'mock-8',
    name: 'Túi Tote Da Bò',
    price: 1490000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=533&fit=crop',
    category: 'Túi xách',
    tags: ['Hàng mới', 'Quà tặng'],
  },
  {
    id: 'mock-9',
    name: 'Vòng Tay Ngọc Trai',
    price: 350000,
    originalPrice: 490000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=533&fit=crop',
    category: 'Trang sức',
    tags: ['Deal Sốc', 'Freeship'],
  },
  {
    id: 'mock-10',
    name: 'Dây Chuyền Bạc Ý',
    price: 590000,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=533&fit=crop',
    category: 'Trang sức',
    tags: ['Hàng mới', 'Hoàn xu'],
  },
  {
    id: 'mock-11',
    name: 'Mũ Fedora Vintage',
    price: 290000,
    originalPrice: 390000,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=533&fit=crop',
    category: 'Phụ kiện',
    tags: ['Deal Sốc', 'Quà tặng'],
  },
  {
    id: 'mock-12',
    name: 'Khăn Lụa Họa Tiết',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=533&fit=crop',
    category: 'Phụ kiện',
    tags: ['Hàng mới', 'Freeship'],
  },
  {
    id: 'mock-13',
    name: 'Áo Blazer Dáng Rộng',
    price: 1190000,
    originalPrice: 1590000,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=533&fit=crop',
    category: 'Áo',
    tags: ['Deal Sốc', 'Hoàn xu', 'Freeship'],
  },
  {
    id: 'mock-14',
    name: 'Váy Suông Công Sở',
    price: 690000,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=533&fit=crop',
    category: 'Váy đầm',
    tags: ['Hoàn xu', 'Quà tặng'],
  },
  {
    id: 'mock-15',
    name: 'Quần Short Đũi',
    price: 350000,
    originalPrice: 450000,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=533&fit=crop',
    category: 'Quần',
    tags: ['Deal Sốc', 'Hàng mới'],
  },
  {
    id: 'mock-16',
    name: 'Bông Tai Ngọc Trai',
    price: 290000,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=533&fit=crop',
    category: 'Trang sức',
    tags: ['Freeship', 'Quà tặng'],
  },
];

// Helper functions for filtering
export function filterByCategory(products: MockProduct[], category: ProductCategory): MockProduct[] {
  return products.filter(p => p.category === category);
}

export function filterByTag(products: MockProduct[], tag: ProductTag): MockProduct[] {
  return products.filter(p => p.tags.includes(tag));
}

export function filterByMultipleTags(products: MockProduct[], tags: ProductTag[]): MockProduct[] {
  if (tags.length === 0) return products;
  return products.filter(p => tags.some(tag => p.tags.includes(tag)));
}

// Format price helper
export function formatMockPrice(price: number): string {
  return price.toLocaleString('vi-VN') + '₫';
}
