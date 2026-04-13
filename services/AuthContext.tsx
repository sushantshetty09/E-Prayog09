import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: string;
  profileData: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: '',
  profileData: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState('');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      // Guard against hanging profile requests causing route-level infinite loaders.
      const profileQuery = supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 8000);
      });
      const { data } = await Promise.race([profileQuery, timeout]) as any;
      
      if (data) {
        setProfileData(data as UserProfile);
        setRole(data.role || 'Student');
      } else {
        setRole('Student');
        setProfileData(null);
      }
    } catch (e) {
      console.error('Error fetching profile:', e);
      setRole('Student');
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        // Keep auth state in sync without forcing full-screen loading on token refresh events.
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id).catch(() => setLoading(false));
        } else {
          setUser(null);
          setRole('');
          setProfileData(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } finally {
      setUser(null);
      setSession(null);
      setRole('');
      setProfileData(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, role, profileData, loading, signOut: handleSignOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
