import React, { createContext, useContext, useState, useEffect } from 'react';
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

// ID counters for each role
let customerCounter = 1;
let ownerCounter = 1;
let brokerCounter = 1;

// Function to generate unique IDs based on role
const generateUniqueId = (role: 'customer' | 'owner' | 'broker' | 'admin'): string => {
  switch (role) {
    case 'customer':
      const customerId = `ECC1547${customerCounter.toString().padStart(3, '0')}`;
      customerCounter++;
      return customerId;
    case 'owner':
      const ownerId = `ECO2547${ownerCounter.toString().padStart(3, '0')}`;
      ownerCounter++;
      return ownerId;
    case 'broker':
      const brokerId = `ECB3547${brokerCounter.toString().padStart(3, '0')}`;
      brokerCounter++;
      return brokerId;
    case 'admin':
      return 'ADMIN001';
    default:
      return Date.now().toString();
  }
};

// Mock users for demo with proper IDs
const mockUsers: User[] = [
  {
    id: 'ADMIN001',
    name: 'Admin User',
    email: 'admin@ecrbeachresorts.com',
    phone: '+91 9876543210',
    role: 'admin',
    kyc_status: 'verified',
    subscription_status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'ECO2547001',
    name: 'John Smith',
    email: 'owner@ecrbeachresorts.com',
    phone: '+91 9876543211',
    role: 'owner',
    kyc_status: 'verified',
    subscription_status: 'active',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'ECB3547001',
    name: 'Sarah Wilson',
    email: 'broker@ecrbeachresorts.com',
    phone: '+91 9876543212',
    role: 'broker',
    kyc_status: 'verified',
    subscription_status: 'active',
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: 'ECC1547001',
    name: 'David Johnson',
    email: 'customer@ecrbeachresorts.com',
    phone: '+91 9876543213',
    role: 'customer',
    kyc_status: 'verified',
    created_at: '2024-02-15T00:00:00Z'
  }
];

// Initialize counters based on existing users
const initializeCounters = () => {
  const customers = mockUsers.filter(u => u.role === 'customer');
  const owners = mockUsers.filter(u => u.role === 'owner');
  const brokers = mockUsers.filter(u => u.role === 'broker');
  
  customerCounter = customers.length + 1;
  ownerCounter = owners.length + 1;
  brokerCounter = brokers.length + 1;
};

// Initialize counters
initializeCounters();

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('ecr_beach_resorts_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('ecr_beach_resorts_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser && password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('ecr_beach_resorts_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
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
      // Mock signup - in production, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (existingUser) {
        setIsLoading(false);
        return false;
      }
      
      // Generate unique ID based on role
      const uniqueId = generateUniqueId(userData.role);
      
      // Create new user
      const newUser: User = {
        id: uniqueId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        kyc_status: 'pending',
        subscription_status: userData.role !== 'customer' ? 'trial' : undefined,
        created_at: new Date().toISOString()
      };
      
      // Add to mock users (in production, this would be handled by the backend)
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('ecr_beach_resorts_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecr_beach_resorts_user');
  };

  const switchRole = (role: User['role']) => {
    if (user?.role === 'admin') {
      const newUser = { ...user, role };
      setUser(newUser);
      localStorage.setItem('ecr_beach_resorts_user', JSON.stringify(newUser));
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