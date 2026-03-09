import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import UserProfileSection from '@/components/UserProfileSection';

export default function ProfilePage() {
  const { user, profile, mockUser, isLoggedIn, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Đã đăng xuất');
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Khách';
  const initials = displayName.slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pb-20 space-y-4 p-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* User Info Header */}
      <div className="bg-gradient-to-br from-foreground to-foreground/80 px-6 pb-8 pt-12 text-background">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-background/20">
            <AvatarFallback className="bg-background/10 text-background text-xl font-display">
              {mockUser ? mockUser.name.slice(0, 2).toUpperCase() : initials}
            </AvatarFallback>
            {(mockUser?.avatar || profile?.avatar_url) && (
              <img src={mockUser?.avatar || profile?.avatar_url || ''} alt="Avatar" className="h-full w-full object-cover" />
            )}
          </Avatar>
          <div>
            <h1 className="font-display text-lg font-semibold">{mockUser ? mockUser.name : displayName}</h1>
            <p className="text-xs text-background/70 font-body">{mockUser ? 'Zalo User' : user?.email}</p>
            <Badge variant="secondary" className="mt-1 bg-background/15 text-background border-none text-[10px] uppercase tracking-widest">
              Thành viên Bạc
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="mx-4 -mt-4">
        <UserProfileSection />
      </div>

      {/* Logout */}
      {isLoggedIn && (
        <div className="mx-4 mt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-card py-3.5 shadow-sm transition-colors active:bg-muted/50"
          >
            <LogOut className="h-4 w-4 text-destructive" />
            <span className="font-body text-sm font-medium text-destructive">Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
