import { User, UserRole } from '@/contexts/AuthContext';

// Interfaces
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'late' | 'absent' | 'half-day' | 'leave';
  workHours: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid';
}

export interface DbSchema {
  users: User[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payroll: PayrollRecord[];
}

const STORAGE_KEY = 'dayflow_db';

// Default Data (preserving original mocks)
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@dayflow.com',
    name: 'Alex Johnson',
    role: 'admin',
    employeeId: 'EMP001',
    department: 'Management',
    position: 'HR Director',
    joinDate: '2022-01-15',
    phone: '+1 (555) 123-4567',
    address: '123 Corporate Ave, Suite 500',
    // Password will be stored separately or assume default for demo
  },
  {
    id: '2',
    email: 'employee@dayflow.com',
    name: 'Sarah Chen',
    role: 'employee',
    employeeId: 'EMP042',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2023-03-20',
    phone: '+1 (555) 987-6543',
    address: '456 Tech Lane, Building B',
  }
];

// Mock user passwords for demo since we can't hash real ones easily in local storage safely
// In a real app, this would never be done.
const userPasswords: Record<string, string> = {
  '1': 'admin123',
  '2': 'employee123'
};

const defaultAttendance: AttendanceRecord[] = [
  { id: '1', userId: '2', date: '2025-01-03', checkIn: '09:02 AM', checkOut: '06:15 PM', status: 'present', workHours: '9h 13m' },
  { id: '2', userId: '2', date: '2025-01-02', checkIn: '09:45 AM', checkOut: '06:00 PM', status: 'late', workHours: '8h 15m' },
];

const defaultLeaves: LeaveRequest[] = [
  {
    id: '1',
    userId: '2',
    employeeName: 'Sarah Chen',
    type: 'paid',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    days: 3,
    status: 'pending',
    reason: 'Family vacation',
  }
];

export const storageService = {
  init: () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      const initialData: DbSchema = {
        users: defaultUsers,
        attendance: defaultAttendance,
        leaves: defaultLeaves,
        payroll: []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      
      // Store passwords separately for simplicity
      if (!localStorage.getItem('dayflow_passwords')) {
        localStorage.setItem('dayflow_passwords', JSON.stringify(userPasswords));
      }
    }
  },

  getData: (): DbSchema => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { users: [], attendance: [], leaves: [], payroll: [] };
  },

  saveData: (data: DbSchema) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // User Methods
  getUsers: () => storageService.getData().users,
  
  getUserByEmail: (email: string) => {
    return storageService.getData().users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  addUser: (user: User, password: string) => {
    const data = storageService.getData();
    data.users.push(user);
    storageService.saveData(data);
    
    // Save password
    const passwords = JSON.parse(localStorage.getItem('dayflow_passwords') || '{}');
    passwords[user.id] = password;
    localStorage.setItem('dayflow_passwords', JSON.stringify(passwords));
    
    return user;
  },

  verifyCredentials: (email: string, password: string): User | null => {
    const user = storageService.getUserByEmail(email);
    if (!user) return null;

    const passwords = JSON.parse(localStorage.getItem('dayflow_passwords') || '{}');
    if (passwords[user.id] === password) return user;
    
    return null;
  },

  updateUser: (updatedUser: User) => {
    const data = storageService.getData();
    const index = data.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      data.users[index] = updatedUser;
      storageService.saveData(data);
      return updatedUser;
    }
    return null;
  },

  // Attendance Methods
  getAttendance: () => storageService.getData().attendance,
  
  getAttendanceByUserId: (userId: string) => {
    return storageService.getData().attendance.filter(a => a.userId === userId);
  },

  addAttendance: (record: AttendanceRecord) => {
    const data = storageService.getData();
    data.attendance.push(record);
    storageService.saveData(data);
    return record;
  },

  updateAttendance: (record: AttendanceRecord) => {
    const data = storageService.getData();
    const index = data.attendance.findIndex(a => a.id === record.id);
    if (index !== -1) {
      data.attendance[index] = record;
      storageService.saveData(data);
      return record;
    }
    return null;
  },

  // Leave Methods
  getLeaves: () => storageService.getData().leaves,

  getLeavesByUserId: (userId: string) => {
    return storageService.getData().leaves.filter(l => l.userId === userId);
  },

  addLeave: (leave: LeaveRequest) => {
    const data = storageService.getData();
    data.leaves.push(leave);
    storageService.saveData(data);
    return leave;
  },

  updateLeave: (leave: LeaveRequest) => {
    const data = storageService.getData();
    const index = data.leaves.findIndex(l => l.id === leave.id);
    if (index !== -1) {
      data.leaves[index] = leave;
      storageService.saveData(data);
      return leave;
    }
    return null;
  },

  // Payroll Methods
  getPayroll: () => storageService.getData().payroll,

  getPayrollByUserId: (userId: string) => {
    return storageService.getData().payroll.filter(p => p.userId === userId);
  },
  
  addPayroll: (record: PayrollRecord) => {
    const data = storageService.getData();
    data.payroll.push(record);
    storageService.saveData(data);
    return record;
  }
};

// Initialize on load
storageService.init();
