export type ProductColor = {
  name: string;
  hex: string;
};

export type ProductVariant = {
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  nameVi: string;
  category: 'ao' | 'quan' | 'vay' | 'phukien';
  price: number;
  originalPrice?: number;
  images: string[];
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  description: string;
  material: string;
  sold: number;
};

export const categories = [
  { id: 'ao', name: 'Áo', icon: '👕' },
  { id: 'quan', name: 'Quần', icon: '👖' },
  { id: 'vay', name: 'Váy', icon: '👗' },
  { id: 'phukien', name: 'Phụ kiện', icon: '👜' },
] as const;

export const sizeGuide = [
  { size: 'S', chest: '82-86', waist: '62-66', hip: '88-92', weight: '43-50' },
  { size: 'M', chest: '86-90', waist: '66-70', hip: '92-96', weight: '50-57' },
  { size: 'L', chest: '90-94', waist: '70-74', hip: '96-100', weight: '57-64' },
  { size: 'XL', chest: '94-98', waist: '74-78', hip: '100-104', weight: '64-72' },
];

const generateVariants = (sizes: string[], colors: ProductColor[]): ProductVariant[] => {
  const variants: ProductVariant[] = [];
  sizes.forEach(size => {
    colors.forEach(color => {
      variants.push({ size, color: color.name, stock: Math.floor(Math.random() * 20) + 5 });
    });
  });
  return variants;
};

const blackWhite: ProductColor[] = [
  { name: 'Đen', hex: '#1a1a1a' },
  { name: 'Trắng', hex: '#f5f0eb' },
];
const earthTones: ProductColor[] = [
  { name: 'Be', hex: '#d4c5a9' },
  { name: 'Nâu', hex: '#8b6f47' },
  { name: 'Đen', hex: '#1a1a1a' },
];
const pastel: ProductColor[] = [
  { name: 'Hồng nhạt', hex: '#f0d4d4' },
  { name: 'Xám', hex: '#b0b0b0' },
  { name: 'Trắng kem', hex: '#f5f0eb' },
];

const allSizes = ['S', 'M', 'L', 'XL'];

export const products: Product[] = [
  {
    id: '1', name: 'Oversized Blazer', nameVi: 'Áo Blazer Dáng Rộng', category: 'ao',
    price: 1290000, originalPrice: 1590000,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
    colors: blackWhite, sizes: allSizes, variants: generateVariants(allSizes, blackWhite),
    description: 'Blazer dáng rộng phong cách hiện đại, phù hợp cho cả công sở và dạo phố.', material: '65% Polyester, 35% Viscose', sold: 142,
  },
  {
    id: '2', name: 'Silk Camisole Top', nameVi: 'Áo Hai Dây Lụa', category: 'ao',
    price: 590000,
    images: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'],
    colors: pastel, sizes: allSizes, variants: generateVariants(allSizes, pastel),
    description: 'Áo hai dây chất liệu lụa mềm mại, thanh lịch cho mọi dịp.', material: '100% Lụa tự nhiên', sold: 230,
  },
  {
    id: '3', name: 'Wide Leg Trousers', nameVi: 'Quần Ống Rộng', category: 'quan',
    price: 890000, originalPrice: 1090000,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
    colors: earthTones, sizes: allSizes, variants: generateVariants(allSizes, earthTones),
    description: 'Quần ống rộng thanh lịch, tôn dáng cho mọi vóc người.', material: '80% Cotton, 20% Linen', sold: 187,
  },
  {
    id: '4', name: 'Tailored Slim Pants', nameVi: 'Quần Âu Ôm', category: 'quan',
    price: 790000,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600'],
    colors: blackWhite, sizes: allSizes, variants: generateVariants(allSizes, blackWhite),
    description: 'Quần âu dáng ôm cổ điển, phù hợp cho mọi phong cách.', material: '70% Polyester, 30% Rayon', sold: 156,
  },
  {
    id: '5', name: 'Midi Wrap Dress', nameVi: 'Váy Quấn Midi', category: 'vay',
    price: 1190000,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    colors: earthTones, sizes: allSizes, variants: generateVariants(allSizes, earthTones),
    description: 'Váy quấn midi nữ tính, tôn vòng eo cho phái đẹp.', material: '100% Viscose', sold: 298,
  },
  {
    id: '6', name: 'Slip Dress Satin', nameVi: 'Váy Suông Satin', category: 'vay',
    price: 990000, originalPrice: 1290000,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600', 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600'],
    colors: pastel, sizes: allSizes, variants: generateVariants(allSizes, pastel),
    description: 'Váy suông satin mềm mịn, sang trọng cho buổi tối.', material: '95% Polyester Satin, 5% Spandex', sold: 175,
  },
  {
    id: '7', name: 'Leather Tote Bag', nameVi: 'Túi Tote Da', category: 'phukien',
    price: 1490000,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600'],
    colors: [{ name: 'Nâu', hex: '#8b6f47' }, { name: 'Đen', hex: '#1a1a1a' }],
    sizes: ['One Size'], variants: [{ size: 'One Size', color: 'Nâu', stock: 15 }, { size: 'One Size', color: 'Đen', stock: 12 }],
    description: 'Túi tote da thật cao cấp, dung tích lớn cho mọi nhu cầu.', material: '100% Da bò thật', sold: 89,
  },
  {
    id: '8', name: 'Minimalist Watch', nameVi: 'Đồng Hồ Minimalist', category: 'phukien',
    price: 2190000,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600'],
    colors: [{ name: 'Vàng hồng', hex: '#b76e79' }, { name: 'Bạc', hex: '#c0c0c0' }],
    sizes: ['One Size'], variants: [{ size: 'One Size', color: 'Vàng hồng', stock: 8 }, { size: 'One Size', color: 'Bạc', stock: 10 }],
    description: 'Đồng hồ phong cách tối giản, thanh lịch cho mọi cổ tay.', material: 'Thép không gỉ, mặt kính sapphire', sold: 67,
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
