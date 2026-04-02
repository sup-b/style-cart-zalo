import React, { createContext, useContext, useState, useCallback } from 'react';

type VoucherContextType = {
  savedVoucherIds: string[];
  saveVoucher: (id: string) => void;
  isVoucherSaved: (id: string) => boolean;
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

  const isVoucherSaved = useCallback((id: string) => {
    return savedVoucherIds.includes(id);
  }, [savedVoucherIds]);

  return (
    <VoucherContext.Provider value={{ savedVoucherIds, saveVoucher, isVoucherSaved }}>
      {children}
    </VoucherContext.Provider>
  );
}

export function useVoucher() {
  const ctx = useContext(VoucherContext);
  if (!ctx) throw new Error('useVoucher must be used within VoucherProvider');
  return ctx;
}
