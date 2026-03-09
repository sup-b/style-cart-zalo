import { ArrowLeft, Bell, Moon, Globe, Shield, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export default function AppSettingsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsGroups = [
    {
      title: 'Tùy chỉnh',
      items: [
        {
          icon: Bell,
          label: 'Thông báo đẩy',
          type: 'toggle' as const,
          value: notifications,
          onChange: (v: boolean) => { setNotifications(v); toast.success(v ? 'Đã bật thông báo' : 'Đã tắt thông báo'); },
        },
        {
          icon: Moon,
          label: 'Chế độ tối',
          type: 'toggle' as const,
          value: darkMode,
          onChange: (v: boolean) => { setDarkMode(v); toast('Tính năng đang phát triển', { icon: '🚧' }); },
        },
        {
          icon: Globe,
          label: 'Ngôn ngữ',
          type: 'link' as const,
          detail: 'Tiếng Việt',
          onClick: () => toast('Tính năng đang phát triển', { icon: '🚧' }),
        },
      ],
    },
    {
      title: 'Bảo mật & Dữ liệu',
      items: [
        {
          icon: Shield,
          label: 'Đổi mật khẩu',
          type: 'link' as const,
          onClick: () => toast('Tính năng đang phát triển', { icon: '🚧' }),
        },
        {
          icon: Trash2,
          label: 'Xóa tài khoản',
          type: 'link' as const,
          danger: true,
          onClick: () => toast('Vui lòng liên hệ hỗ trợ để xóa tài khoản', { icon: '⚠️' }),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="sticky top-0 z-40 flex items-center gap-3 bg-background/95 px-4 py-3 backdrop-blur-md border-b border-border">
        <button onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="font-display text-lg">Cài đặt</h1>
      </div>

      <div className="p-4 space-y-4">
        {settingsGroups.map(group => (
          <div key={group.title}>
            <h2 className="mb-2 font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">{group.title}</h2>
            <div className="rounded-xl bg-card shadow-sm overflow-hidden">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                const isLast = i === group.items.length - 1;
                return (
                  <div
                    key={item.label}
                    onClick={item.type === 'link' ? item.onClick : undefined}
                    className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${item.type === 'link' ? 'cursor-pointer active:bg-secondary/50' : ''} ${!isLast ? 'border-b border-border/50' : ''}`}
                  >
                    <Icon className={`h-5 w-5 ${(item as any).danger ? 'text-destructive' : 'text-foreground/60'}`} strokeWidth={1.5} />
                    <span className={`flex-1 font-body text-sm ${(item as any).danger ? 'text-destructive' : ''}`}>{item.label}</span>
                    {item.type === 'toggle' && (
                      <Switch checked={item.value} onCheckedChange={item.onChange} />
                    )}
                    {item.type === 'link' && (
                      <div className="flex items-center gap-1">
                        {(item as any).detail && <span className="font-body text-xs text-muted-foreground">{(item as any).detail}</span>}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-center font-body text-[10px] text-muted-foreground pt-4">
          Phiên bản 1.0.0 • The Box™
        </p>
      </div>
    </div>
  );
}
