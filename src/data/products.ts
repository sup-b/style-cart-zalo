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

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
