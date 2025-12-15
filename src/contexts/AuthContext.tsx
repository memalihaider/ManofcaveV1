import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role } from '@/lib/permissions';
import { PermissionProvider } from './PermissionContext';

interface User {
  id: string;
  email: string;
  role: Role;
  branchId?: string;
  fullName?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Mock authentication - replace with real API call
    const mockUsers = [
      { email: 'admin@branch1.com', password: 'admin123', role: 'branch_admin' as Role, branchId: '1' },
      { email: 'super@premiumcuts.com', password: 'super123', role: 'super_admin' as Role },
      { email: 'manager@branch1.com', password: 'manager456', role: 'manager' as Role, branchId: '1' },
      { email: 'staff@branch1.com', password: 'staff789', role: 'staff' as Role, branchId: '1' },
      // Customer accounts
      { email: 'john.doe@email.com', password: 'customer123', role: 'customer' as Role, fullName: 'John Doe', phone: '+1234567890' },
      { email: 'jane.smith@email.com', password: 'customer456', role: 'customer' as Role, fullName: 'Jane Smith', phone: '+1234567891' },
      { email: 'mike.johnson@email.com', password: 'customer789', role: 'customer' as Role, fullName: 'Mike Johnson', phone: '+1234567892' },
      { email: 'sarah.wilson@email.com', password: 'customer101', role: 'customer' as Role, fullName: 'Sarah Wilson', phone: '+1234567893' },
      { email: 'david.brown@email.com', password: 'customer202', role: 'customer' as Role, fullName: 'David Brown', phone: '+1234567894' },
      { email: 'emma.davis@email.com', password: 'customer303', role: 'customer' as Role, fullName: 'Emma Davis', phone: '+1234567895' },
    ];

    const foundUser = mockUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData: User = {
        id: foundUser.email,
        email: foundUser.email,
        role: foundUser.role,
        branchId: foundUser.branchId,
        fullName: foundUser.fullName,
        phone: foundUser.phone,
      };

      setUser(userData);
      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      <PermissionProvider currentUser={user}>
        {children}
      </PermissionProvider>
    </AuthContext.Provider>
  );
};