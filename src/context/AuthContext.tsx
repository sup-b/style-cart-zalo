import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'user' | 'admin';

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  default_address: string | null;
  avatar_url: string | null;
};

type MockUser = {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  mockUser: MockUser | null;
  isLoggedIn: boolean;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  mockZaloLogin: () => Promise<MockUser>;
  mockZaloLogout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mockUser, setMockUser] = useState<MockUser | null>(() => {
    try {
      const stored = localStorage.getItem('mockUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    setProfile(data);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Mock Zalo login function
  const mockZaloLogin = async (): Promise<MockUser> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUserData: MockUser = {
          id: 'z12345',
          name: 'Zalo User',
          avatar: 'https://i.pravatar.cc/150?u=zalo',
          role: 'user',
        };
        setMockUser(mockUserData);
        localStorage.setItem('mockUser', JSON.stringify(mockUserData));
        resolve(mockUserData);
      }, 1500);
    });
  };

  const mockZaloLogout = () => {
    setMockUser(null);
    localStorage.removeItem('mockUser');
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Defer profile fetch to avoid blocking
          setTimeout(() => fetchProfile(newSession.user.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Then get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    mockZaloLogout();
  };

  const isLoggedIn = !!user || !!mockUser;
  const isAdmin = isLoggedIn && userRole === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      mockUser,
      isLoggedIn,
      userRole,
      setUserRole,
      isAdmin,
      loading,
      signOut,
      refreshProfile,
      mockZaloLogin,
      mockZaloLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
