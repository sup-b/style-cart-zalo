import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export type Address = {
  id: string;
  user_id: string;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  district: string;
  city: string;
  is_default: boolean;
  created_at: string;
};

export function useAddresses() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Address[];
    },
    enabled: !!user,
  });
}

export function useCreateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (addr: Omit<Address, 'id' | 'created_at' | 'user_id'> & { user_id: string }) => {
      const { data, error } = await supabase.from('addresses').insert({
        user_id: addr.user_id,
        label: addr.label,
        recipient_name: addr.recipient_name,
        phone: addr.phone,
        address_line: addr.address_line,
        district: addr.district,
        city: addr.city,
        is_default: false, // insert as non-default first
      }).select('id').single();
      if (error) throw error;

      // Now set as default if requested (this unsets others via the DB function)
      if (addr.is_default && data?.id) {
        const { error: defErr } = await supabase.rpc('set_default_address', {
          p_address_id: data.id,
          p_user_id: addr.user_id,
        });
        if (defErr) throw defErr;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<Address> & { id: string }) => {
      const { error } = await supabase.from('addresses').update(fields).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useDeleteAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('addresses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}

export function useSetDefaultAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ addressId, userId }: { addressId: string; userId: string }) => {
      const { error } = await supabase.rpc('set_default_address', { p_address_id: addressId, p_user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });
}
