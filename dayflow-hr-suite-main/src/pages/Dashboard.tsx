import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Calendar,
  UserCheck,
  UserX,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { LiveClock } from '@/components/ui/live-clock';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { LeaveRequestsWidget } from '@/components/dashboard/LeaveRequestsWidget';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';
import { QuickStatsWidget } from '@/components/dashboard/QuickStatsWidget';
import { storageService } from '@/services/storage';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';

  // Real stats state
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      calculateStats();
    }
  }, [user, isAdmin]);

  const calculateStats = () => {
    if (!user) return;

    if (isAdmin) {
      const users = storageService.getUsers();
      const attendance = storageService.getAttendance();
      const leaves = storageService.getLeaves();
      const today = new Date().toISOString().split('T')[0];

      const totalEmployees = users.filter(u => u.role === 'employee').length;
      const presentToday = attendance.filter(a => a.date === today && a.status === 'present').length;
      const onLeaveToday = leaves.filter(l =>
        l.status === 'approved' && l.startDate <= today && l.endDate >= today
      ).length;
      const absent = Math.max(0, totalEmployees - presentToday - onLeaveToday);

      setStats([
        {
          label: 'Total Employees',
          value: totalEmployees,
          icon: Users,
          change: '+0%',
          isPositive: true,
          color: 'primary',
        },
        {
          label: 'Present Today',
          value: presentToday,
          icon: UserCheck,
          change: 'today',
          isPositive: true,
          color: 'success',
        },
        {
          label: 'On Leave',
          value: onLeaveToday,
          icon: Calendar,
          change: 'today',
          isPositive: true,
          color: 'warning',
        },
        {
          label: 'Absent',
          value: absent,
          icon: UserX,
          change: 'today',
          isPositive: false,
          color: 'destructive',
        },
      ]);
    } else {
      const myAttendance = storageService.getAttendanceByUserId(user.id);
      const myLeaves = storageService.getLeavesByUserId(user.id);

      const daysPresent = myAttendance.filter(a => a.status === 'present').length;
      const leavesTaken = myLeaves.filter(l => l.status === 'approved').reduce((acc, curr) => acc + curr.days, 0);
      const leaveBalance = Math.max(0, 20 - leavesTaken);

      const workHours = daysPresent * 8;

      setStats([
        {
          label: 'Days Present',
          value: daysPresent,
          icon: UserCheck,
          change: 'total',
          isPositive: true,
          color: 'success',
        },
        {
          label: 'Leave Balance',
          value: leaveBalance,
          icon: Calendar,
          change: 'days left',
          isPositive: true,
          color: 'primary',
        },
        {
          label: 'Work Hours',
          value: workHours,
          icon: Clock,
          change: 'approx',
          isPositive: true,
          color: 'accent',
        },
        {
          label: 'Projects',
          value: 2,
          icon: Briefcase,
          change: 'active',
          isPositive: true,
          color: 'warning',
        },
      ]);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back, <span className="text-gradient-primary">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening with your {isAdmin ? 'team' : 'work'} today.
            </p>
          </div>
          <LiveClock />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <FloatingCard key={stat.label} delay={index * 0.1}>
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color === 'primary'
                      ? 'bg-primary/10'
                      : stat.color === 'success'
                        ? 'bg-success/10'
                        : stat.color === 'warning'
                          ? 'bg-warning/10'
                          : stat.color === 'destructive'
                            ? 'bg-destructive/10'
                            : 'bg-accent/10'
                    }`}
                >
                  <stat.icon
                    className={`h-6 w-6 ${stat.color === 'primary'
                        ? 'text-primary'
                        : stat.color === 'success'
                          ? 'text-success'
                          : stat.color === 'warning'
                            ? 'text-warning'
                            : stat.color === 'destructive'
                              ? 'text-destructive'
                              : 'text-accent'
                      }`}
                  />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-success' : 'text-destructive'
                    }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>

              <div className="mt-4">
                <AnimatedCounter
                  value={stat.value}
                  className="font-display text-3xl font-bold text-foreground"
                />
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </FloatingCard>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div variants={itemVariants}>
              <AttendanceWidget isAdmin={isAdmin} />
            </motion.div>

            {isAdmin && (
              <motion.div variants={itemVariants}>
                <LeaveRequestsWidget />
              </motion.div>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <QuickStatsWidget isAdmin={isAdmin} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <RecentActivityWidget />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
