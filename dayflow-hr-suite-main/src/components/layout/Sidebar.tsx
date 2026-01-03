import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['admin', 'hr', 'employee'],
  },
  {
    icon: User,
    label: 'My Profile',
    path: '/profile',
    roles: ['admin', 'hr', 'employee'],
  },
  {
    icon: Users,
    label: 'Employees',
    path: '/employees',
    roles: ['admin', 'hr'],
  },
  {
    icon: Clock,
    label: 'Attendance',
    path: '/attendance',
    roles: ['admin', 'hr', 'employee'],
  },
  {
    icon: Calendar,
    label: 'Leave Management',
    path: '/leave',
    roles: ['admin', 'hr', 'employee'],
  },
  {
    icon: DollarSign,
    label: 'Payroll',
    path: '/payroll',
    roles: ['admin', 'hr', 'employee'],
  },
  {
    icon: FileText,
    label: 'Reports',
    path: '/reports',
    roles: ['admin', 'hr'],
  },
  {
    icon: Settings,
    label: 'Settings',
    path: '/settings',
    roles: ['admin', 'hr', 'employee'],
  },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <motion.aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <motion.div
          className="flex items-center gap-3"
          animate={{ opacity: isCollapsed ? 0 : 1 }}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <span className="font-display text-xl font-bold text-gradient-primary">
              Dayflow
            </span>
          )}
        </motion.div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <item.icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 hidden rounded-lg bg-popover px-3 py-2 text-sm font-medium text-popover-foreground shadow-lg group-hover:block">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl p-3 transition-colors',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <div className="relative h-10 w-10 flex-shrink-0">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar bg-success" />
          </div>
          
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="flex-1 overflow-hidden"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <p className="truncate text-sm font-medium text-foreground">
                  {user?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className={cn(
            'mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
