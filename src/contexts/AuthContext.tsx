import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeAuth } from '../lib/supabase';

// Generate a valid UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'broker' | 'customer';
  accountActivated?: boolean;
  kycStatus?: 'pending' | 'verified' | 'rejected';
}

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
  isLoading: boolean;
  switchRole: (role: 'admin' | 'owner' | 'broker' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Demo login - simulate different user roles
      let role: 'admin' | 'owner' | 'broker' | 'customer' = 'customer';
      let name = 'Demo User';
      
      if (signupData) {
        const parsedSignupData = JSON.parse(signupData);
        if (parsedSignupData.email === email) {
          userData = parsedSignupData;
          sessionStorage.removeItem('signupData'); // Clear after use
        }
      }
      
      // If not from signup, use demo login logic
      if (!userData) {
        let role: 'admin' | 'owner' | 'broker' | 'customer' = 'customer';
        let name = 'Demo User';
        
        if (email.includes('admin')) {
          role = 'admin';
          name = 'Admin User';
        } else if (email.includes('owner')) {
          role = 'owner';
          name = 'John Smith (Owner)';
        } else if (email.includes('broker')) {
          role = 'broker';
          name = 'Sarah Wilson (Broker)';
        } else {
          role = 'customer';
          name = 'David Johnson (Customer)';
        }
        
        userData = { name, email, role };
      }

      const demoUser: User = {
        id: generateUUID(),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        accountActivated: false,
        kycStatus: 'pending'
      };

      setUser(demoUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
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
      // Store signup data for later login
      sessionStorage.setItem('signupData', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

      // Check if this is a login after signup
      const signupData = sessionStorage.getItem('signupData');
      let userData = null;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading,
      switchRole
    }}>
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