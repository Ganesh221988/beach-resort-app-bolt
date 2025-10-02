import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, auth } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'broker';
  }) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: User['role']) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting session:', error);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        // Get email from auth user
        const { data: authUser } = await auth.getUser();

        setUser({
          id: data.id,
          name: data.name,
          email: authUser.user?.email || '',
          phone: data.phone || '',
          role: data.role,
          kyc_status: data.kyc_status,
          subscription_status: data.subscription_status || undefined,
          created_at: data.created_at
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'customer' | 'owner' | 'broker';
  }): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Update user profile with additional data
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            phone: userData.phone,
            subscription_status: userData.role !== 'customer' ? 'trial' : null
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        await fetchUserProfile(data.user.id);
        return true;
      }

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    auth.signOut();
  };

  const switchRole = (role: User['role']) => {
    // Only allow admins to switch roles (for demo purposes)
    if (user?.role === 'admin') {
      const newUser = { ...user, role };
      setUser(newUser);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    switchRole,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}