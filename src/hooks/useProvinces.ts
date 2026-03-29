import { useState, useEffect, useMemo } from 'react';

export type Ward = { code: number; name: string };
export type District = { code: number; name: string; wards: Ward[] };
export type Province = { code: number; name: string; districts: District[] };

let cachedData: Province[] | null = null;

export function useProvinces() {
  const [provinces, setProvinces] = useState<Province[]>(cachedData ?? []);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cachedData) return;
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: Province[]) => {
        cachedData = data;
        setProvinces(data);
      })
      .catch(() => setError('Không thể tải danh sách tỉnh thành'))
      .finally(() => setIsLoading(false));
  }, []);

  return { provinces, isLoading, error };
}

export function useDistricts(provinceCode: string) {
  const { provinces } = useProvinces();
  return useMemo(() => {
    if (!provinceCode) return [];
    const p = provinces.find(p => String(p.code) === provinceCode);
    return p?.districts ?? [];
  }, [provinces, provinceCode]);
}

export function useWards(provinceCode: string, districtCode: string) {
  const districts = useDistricts(provinceCode);
  return useMemo(() => {
    if (!districtCode) return [];
    const d = districts.find(d => String(d.code) === districtCode);
    return d?.wards ?? [];
  }, [districts, districtCode]);
}
