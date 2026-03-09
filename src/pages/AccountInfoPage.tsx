import { useState, useEffect } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AccountInfoPage() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setPhone(profile.phone || '');
      setAddress(profile.default_address || '');
    }
  }, [profile]);

  const initials = (displayName || user?.email?.split('@')[0] || 'U').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
        display_name: displayName.trim() || null,
        phone: phone.trim() || null,
        default_address: address.trim() || null,
      }, { onConflict: 'user_id' });
      if (error) throw error;
      await refreshProfile();
      toast.success('Đã cập nhật thông tin');
    } catch {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-lg">Thông tin tài khoản</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarFallback className="bg-secondary text-foreground text-xl font-display">{initials}</AvatarFallback>
              {profile?.avatar_url && (
                <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
              )}
            </Avatar>
            <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background shadow-md">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-body text-xs text-muted-foreground">{user?.email}</p>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-card p-4 shadow-sm space-y-4">
          <div>
            <label className="mb-1 block font-body text-xs text-muted-foreground">Tên hiển thị</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Nhập tên của bạn"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs text-muted-foreground">Số điện thoại</label>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              type="tel"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="0901234567"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs text-muted-foreground">Địa chỉ mặc định</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 font-body text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
              placeholder="Số nhà, đường, phường/xã, quận/huyện"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-foreground py-3 font-body text-sm font-semibold uppercase tracking-widest text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}
