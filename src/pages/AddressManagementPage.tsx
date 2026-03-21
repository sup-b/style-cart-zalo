import { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Trash2, Star, Pencil, Home, Building2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress, type Address } from '@/hooks/useAddresses';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const labelOptions = [
  { value: 'Nhà', icon: Home },
  { value: 'Công ty', icon: Building2 },
  { value: 'Khác', icon: Briefcase },
];

const emptyForm = { label: 'Nhà', recipient_name: '', phone: '', address_line: '', district: '', city: '', is_default: false };

export default function AddressManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddr = useCreateAddress();
  const updateAddr = useUpdateAddress();
  const deleteAddr = useDeleteAddress();
  const setDefault = useSetDefaultAddress();

  const [view, setView] = useState<'list' | 'form'>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm, is_default: addresses.length === 0 });
    setView('form');
  };

  const openEdit = (a: Address) => {
    setEditId(a.id);
    setForm({ label: a.label, recipient_name: a.recipient_name, phone: a.phone, address_line: a.address_line, district: a.district, city: a.city, is_default: a.is_default });
    setView('form');
  };

  const handleSave = async () => {
    if (!form.recipient_name.trim() || !form.phone.trim() || !form.address_line.trim()) {
      toast.warning('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!/^[0-9]{10,11}$/.test(form.phone.trim())) {
      toast.warning('Số điện thoại không hợp lệ');
      return;
    }
    try {
      if (editId) {
        await updateAddr.mutateAsync({ id: editId, ...form });
        if (form.is_default && user) {
          await setDefault.mutateAsync({ addressId: editId, userId: user.id });
        }
        toast.success('Cập nhật địa chỉ thành công');
      } else {
        await createAddr.mutateAsync({ ...form, user_id: user!.id });
        toast.success('Thêm địa chỉ thành công');
      }
      setView('list');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddr.mutateAsync(id);
      toast.success('Đã xóa địa chỉ');
    } catch {
      toast.error('Không thể xóa');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    try {
      await setDefault.mutateAsync({ addressId: id, userId: user.id });
      toast.success('Đã đặt làm mặc định');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <button onClick={() => view === 'form' ? setView('list') : navigate(-1)} className="active:scale-95 transition-transform">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-base font-semibold">{view === 'form' ? (editId ? 'Sửa địa chỉ' : 'Thêm địa chỉ') : 'Địa chỉ giao hàng'}</h1>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="p-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)
            ) : addresses.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/40" />
                <p className="font-body text-sm text-muted-foreground">Chưa có địa chỉ nào</p>
              </div>
            ) : (
              addresses.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`relative rounded-xl border bg-card p-4 shadow-sm transition-colors ${a.is_default ? 'border-primary/40' : 'border-border'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-muted px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{a.label}</span>
                        {a.is_default && (
                          <span className="rounded bg-primary/10 px-2 py-0.5 font-body text-[10px] font-semibold text-primary">Mặc định</span>
                        )}
                      </div>
                      <p className="font-body text-sm font-semibold">{a.recipient_name}</p>
                      <p className="font-body text-xs text-muted-foreground">{a.phone}</p>
                      <p className="font-body text-xs text-muted-foreground">{[a.address_line, a.district, a.city].filter(Boolean).join(', ')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(a)} className="rounded-lg p-2 transition-colors hover:bg-muted active:scale-95">
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => handleDelete(a.id)} className="rounded-lg p-2 transition-colors hover:bg-destructive/10 active:scale-95">
                        <Trash2 className="h-4 w-4 text-destructive/60" />
                      </button>
                    </div>
                  </div>
                  {!a.is_default && (
                    <button onClick={() => handleSetDefault(a.id)} className="mt-2 flex items-center gap-1 font-body text-xs text-primary active:opacity-70">
                      <Star className="h-3 w-3" /> Đặt làm mặc định
                    </button>
                  )}
                </motion.div>
              ))
            )}
            <button onClick={openAdd} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 py-4 font-body text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary active:scale-[0.98]">
              <Plus className="h-4 w-4" /> Thêm địa chỉ mới
            </button>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }} className="p-4 space-y-4">
            {/* Label picker */}
            <div>
              <label className="font-body text-xs text-muted-foreground mb-2 block">Loại địa chỉ</label>
              <div className="flex gap-2">
                {labelOptions.map(opt => {
                  const Icon = opt.icon;
                  const active = form.label === opt.value;
                  return (
                    <button key={opt.value} onClick={() => setForm(f => ({ ...f, label: opt.value }))}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 font-body text-xs transition-colors ${active ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground'}`}>
                      <Icon className="h-3.5 w-3.5" /> {opt.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <input value={form.recipient_name} onChange={e => setForm(f => ({ ...f, recipient_name: e.target.value }))}
                placeholder="Họ và tên người nhận *" maxLength={100}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))}
                placeholder="Số điện thoại *" maxLength={11} inputMode="numeric"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <input value={form.address_line} onChange={e => setForm(f => ({ ...f, address_line: e.target.value }))}
                placeholder="Địa chỉ chi tiết (số nhà, đường) *" maxLength={200}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              <div className="grid grid-cols-2 gap-3">
                <input value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}
                  placeholder="Quận/Huyện" maxLength={100}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  placeholder="Tỉnh/Thành phố" maxLength={100}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            {/* Default toggle */}
            <label className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))}
                className="h-4 w-4 accent-primary" />
              <span className="font-body text-sm">Đặt làm địa chỉ mặc định</span>
            </label>

            <button onClick={handleSave} disabled={createAddr.isPending || updateAddr.isPending}
              className="w-full rounded-lg bg-foreground py-3.5 font-body text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50 active:scale-[0.98]">
              {createAddr.isPending || updateAddr.isPending ? 'Đang lưu...' : (editId ? 'Cập nhật địa chỉ' : 'Lưu địa chỉ')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
