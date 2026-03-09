import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Product, ProductColor, ProductVariant } from '@/data/products';

// Fetch all products with colors and variants
async function fetchProducts(): Promise<Product[]> {
  const [{ data: prods, error: pe }, { data: colors, error: ce }, { data: variants, error: ve }] = await Promise.all([
    supabase.from('products').select('*').order('created_at', { ascending: true }),
    supabase.from('product_colors').select('*'),
    supabase.from('product_variants').select('*'),
  ]);

  if (pe) throw pe;
  if (ce) throw ce;
  if (ve) throw ve;

  return (prods || []).map(p => {
    const pColors: ProductColor[] = (colors || []).filter(c => c.product_id === p.id).map(c => ({ name: c.name, hex: c.hex }));
    const pVariants: ProductVariant[] = (variants || []).filter(v => v.product_id === p.id).map(v => ({ size: v.size, color: v.color, stock: v.stock }));
    const sizes = [...new Set(pVariants.map(v => v.size))];

    return {
      id: p.id,
      name: p.name,
      nameVi: p.name_vi,
      category: p.category as Product['category'],
      price: p.price,
      originalPrice: p.original_price ?? undefined,
      images: p.images,
      colors: pColors,
      sizes,
      variants: pVariants,
      description: p.description,
      material: p.material,
      sold: p.sold,
    };
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string | undefined) {
  const { data: products, ...rest } = useProducts();
  return { data: products?.find(p => p.id === id), ...rest };
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpsertProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id?: string;
      name: string;
      nameVi: string;
      category: string;
      price: number;
      originalPrice?: number;
      description: string;
      material: string;
    }) => {
      const row = {
        name: data.name,
        name_vi: data.nameVi,
        category: data.category,
        price: data.price,
        original_price: data.originalPrice ?? null,
        description: data.description,
        material: data.material,
      };

      if (data.id) {
        const { error } = await supabase.from('products').update(row).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({
          ...row,
          images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'],
        });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}
