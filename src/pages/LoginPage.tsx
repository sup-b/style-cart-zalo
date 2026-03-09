import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Package, Loader2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { mockZaloLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleZaloLogin = async () => {
    setLoading(true);
    try {
      await mockZaloLogin();
      toast.success('Đăng nhập thành công!', {
        style: { backgroundColor: '#0068FF', color: 'white' },
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast.error('Đăng nhập thất bại');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted/30 px-6">
      {/* Logo & Welcome */}
      <div className="mb-16 flex flex-col items-center gap-6 animate-fade-in">
        <div className="rounded-3xl bg-foreground p-6 shadow-2xl">
          <Package className="h-16 w-16 text-background" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">The Box</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Chào mừng bạn đến với Chic shop
          </p>
        </div>
      </div>

      {/* Zalo Login Button */}
      <button
        onClick={handleZaloLogin}
        disabled={loading}
        className="flex w-full max-w-sm items-center justify-center gap-3 rounded-full py-4 font-body text-base font-semibold uppercase tracking-wide text-white shadow-lg transition-all hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: '#0068FF' }}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <MessageCircle className="h-5 w-5" />
        )}
        <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập bằng Zalo'}</span>
      </button>

      {/* Footer hint */}
      <p className="mt-8 font-body text-xs text-muted-foreground">
        Tiếp tục để khám phá bộ sưu tập thời trang
      </p>
    </div>
  );
}
