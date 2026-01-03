import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storageService } from '@/services/storage';

export type UserRole = 'admin' | 'hr' | 'employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, employeeId: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from local storage on mount (simulating session persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('dayflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const validUser = storageService.verifyCredentials(email, password);

    if (validUser) {
      setUser(validUser);
      localStorage.setItem('dayflow_user', JSON.stringify(validUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
  };

  const register = async (name: string, email: string, password: string, employeeId: string) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check if user exists
    const existingUser = storageService.getUserByEmail(email);
    if (existingUser) {
      setIsLoading(false);
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      role: 'employee', // Default role
      employeeId,
      department: 'Unassigned',
      position: 'Employee',
      joinDate: new Date().toISOString().split('T')[0],
    };

    const createdUser = storageService.addUser(newUser, password);
    setUser(createdUser);
    localStorage.setItem('dayflow_user', JSON.stringify(createdUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
