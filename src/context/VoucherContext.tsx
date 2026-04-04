import React, { createContext, useContext, useState, useCallback } from 'react';
import { ALL_VOUCHERS, type VoucherData } from '@/data/vouchers';

type VoucherContextType = {
  savedVoucherIds: string[];
  saveVoucher: (id: string) => void;
  removeVoucher: (id: string) => void;
  isVoucherSaved: (id: string) => boolean;
  getSavedVouchers: () => VoucherData[];
};

const VoucherContext = createContext<VoucherContextType | undefined>(undefined);

export function VoucherProvider({ children }: { children: React.ReactNode }) {
  const [savedVoucherIds, setSavedVoucherIds] = useState<string[]>([]);

  const saveVoucher = useCallback((id: string) => {
    setSavedVoucherIds(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const removeVoucher = useCallback((id: string) => {
    setSavedVoucherIds(prev => prev.filter(vid => vid !== id));
  }, []);

  const isVoucherSaved = useCallback((id: string) => {
    return savedVoucherIds.includes(id);
  }, [savedVoucherIds]);

  const getSavedVouchers = useCallback(() => {
    return ALL_VOUCHERS.filter((v) => savedVoucherIds.includes(v.id));
  }, [savedVoucherIds]);

  return (
    <VoucherContext.Provider value={{ savedVoucherIds, saveVoucher, removeVoucher, isVoucherSaved, getSavedVouchers }}>
      {children}
    </VoucherContext.Provider>
  );
}

export function useVoucher() {
  const ctx = useContext(VoucherContext);
  if (!ctx) throw new Error('useVoucher must be used within VoucherProvider');
  return ctx;
}
