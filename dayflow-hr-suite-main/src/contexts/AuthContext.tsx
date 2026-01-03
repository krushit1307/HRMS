import { createContext, useContext, useState, ReactNode } from 'react';

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
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'admin@dayflow.com': {
    id: '1',
    email: 'admin@dayflow.com',
    password: 'admin123',
    name: 'Alex Johnson',
    role: 'admin',
    employeeId: 'EMP001',
    department: 'Management',
    position: 'HR Director',
    joinDate: '2022-01-15',
    phone: '+1 (555) 123-4567',
    address: '123 Corporate Ave, Suite 500',
  },
  'employee@dayflow.com': {
    id: '2',
    email: 'employee@dayflow.com',
    password: 'employee123',
    name: 'Sarah Chen',
    role: 'employee',
    employeeId: 'EMP042',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2023-03-20',
    phone: '+1 (555) 987-6543',
    address: '456 Tech Lane, Building B',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email.toLowerCase()];
    
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
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
