import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  LogIn,
  LogOut,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth } from '@/contexts/AuthContext';
import { storageService, AttendanceRecord } from '@/services/storage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const AttendancePage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = () => {
    if (!user) return;
    const records = storageService.getAttendanceByUserId(user.id);
    setAttendanceRecords(records.reverse()); // Newest first

    const today = new Date().toISOString().split('T')[0];
    const record = records.find(a => a.date === today);

    if (record) {
      setTodayRecord(record);
      if (record.checkIn && !record.checkOut) {
        setIsCheckedIn(true);
        setCheckInTime(record.checkIn);
      } else if (record.checkIn && record.checkOut) {
        setIsCheckedIn(false);
        setCheckInTime(record.checkIn);
      }
    }
  };

  const handleCheckIn = () => {
    if (!user) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      userId: user.id,
      date: now.toISOString().split('T')[0],
      checkIn: timeString,
      checkOut: '',
      status: 'present',
      workHours: '0h 0m'
    };

    storageService.addAttendance(newRecord);
    setCheckInTime(timeString);
    setIsCheckedIn(true);
    setTodayRecord(newRecord);
    loadAttendance();
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const updatedRecord = {
      ...todayRecord,
      checkOut: timeString,
      workHours: '8h 30m' // Mock calc
    };

    storageService.updateAttendance(updatedRecord);
    setIsCheckedIn(false);
    setTodayRecord(updatedRecord);
    loadAttendance();
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return 'status-present';
      case 'late':
        return 'status-pending';
      case 'absent':
        return 'status-rejected';
      case 'half-day':
        return 'bg-accent/20 text-accent border-accent/30';
    }
  };

  const getStatusIcon = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'half-day':
        return <Clock className="h-4 w-4 text-accent" />;
    }
  };

  const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
  const lateDays = attendanceRecords.filter(a => a.status === 'late').length;
  const absentDays = attendanceRecords.filter(a => a.status === 'absent').length;

  const stats = [
    { label: 'Present Days', value: presentDays, total: 30, color: 'success' },
    { label: 'Late Days', value: lateDays, total: 30, color: 'warning' },
    { label: 'Absent Days', value: absentDays, total: 30, color: 'destructive' },
    { label: 'Work Hours', value: `${presentDays * 8}h`, color: 'primary' },
  ];

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
              Attendance
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your daily attendance and work hours
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('daily')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'daily'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
                }`}
            >
              Daily
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'weekly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
                }`}
            >
              Weekly
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <FloatingCard key={stat.label} delay={index * 0.1}>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span
                  className={`font-display text-3xl font-bold ${stat.color === 'success'
                      ? 'text-success'
                      : stat.color === 'warning'
                        ? 'text-warning'
                        : stat.color === 'destructive'
                          ? 'text-destructive'
                          : 'text-primary'
                    }`}
                >
                  {stat.value}
                </span>
                {stat.total && (
                  <span className="text-sm text-muted-foreground">
                    / {stat.total}
                  </span>
                )}
              </div>
            </FloatingCard>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Check In/Out Card */}
          <motion.div variants={itemVariants}>
            <FloatingCard>
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Today's Status
              </h3>

              <div className="mb-6 text-center">
                <motion.div
                  className={`mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl ${isCheckedIn ? 'bg-success/20' : 'bg-muted'
                    }`}
                  animate={{
                    scale: isCheckedIn ? [1, 1.05, 1] : 1,
                    boxShadow: isCheckedIn
                      ? ['0 0 0 0 rgba(34,197,94,0.3)', '0 0 0 20px rgba(34,197,94,0)', '0 0 0 0 rgba(34,197,94,0)']
                      : 'none',
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCheckedIn ? Infinity : 0,
                  }}
                >
                  <Clock
                    className={`h-12 w-12 ${isCheckedIn ? 'text-success' : 'text-muted-foreground'
                      }`}
                  />
                </motion.div>

                {todayRecord?.checkOut ? (
                  <>
                    <p className="text-muted-foreground">Day Completed</p>
                    <p className="font-display text-3xl font-bold text-success">
                      {todayRecord.workHours}
                    </p>
                  </>
                ) : isCheckedIn ? (
                  <>
                    <p className="text-muted-foreground">Checked in at</p>
                    <p className="font-display text-3xl font-bold text-success">
                      {checkInTime}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    You haven't checked in yet today
                  </p>
                )}
              </div>

              {isCheckedIn && !todayRecord?.checkOut ? (
                <MagneticButton
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckOut}
                >
                  <LogOut className="h-5 w-5" />
                  Check Out
                </MagneticButton>
              ) : !isCheckedIn && !todayRecord?.checkOut && (
                <MagneticButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckIn}
                >
                  <LogIn className="h-5 w-5" />
                  Check In
                </MagneticButton>
              )}

              {/* Today's summary */}
              {todayRecord && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                    <span className="text-sm text-muted-foreground">Check In</span>
                    <span className="font-medium text-foreground">
                      {todayRecord.checkIn}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                    <span className="text-sm text-muted-foreground">Check Out</span>
                    <span className="font-medium text-foreground">
                      {todayRecord.checkOut || '--:--'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-secondary/30 p-3">
                    <span className="text-sm text-muted-foreground">Work Hours</span>
                    <span className="font-medium text-primary">{todayRecord.workHours}</span>
                  </div>
                </div>
              )}
            </FloatingCard>
          </motion.div>

          {/* Attendance Records Table */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FloatingCard>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Attendance History
                </h3>
                <MagneticButton variant="ghost" size="sm">
                  <Download className="h-4 w-4" />
                  Export
                </MagneticButton>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Check In
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Check Out
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Hours
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((record, index) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border/50 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {record.date}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-foreground">
                            {record.checkIn}
                          </td>
                          <td className="px-4 py-4 text-foreground">
                            {record.checkOut}
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-display font-bold text-primary">
                              {record.workHours}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusBadge(
                                  record.status
                                )}`}
                              >
                                {record.status}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 1-{attendanceRecords.length} of {attendanceRecords.length} records
                </p>
                <div className="flex gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AttendancePage;
