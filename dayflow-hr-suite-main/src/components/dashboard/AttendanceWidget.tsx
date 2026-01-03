import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { storageService, AttendanceRecord } from '@/services/storage';
import { useAuth } from '@/contexts/AuthContext';

interface AttendanceWidgetProps {
  isAdmin: boolean;
}

export const AttendanceWidget = ({ isAdmin }: AttendanceWidgetProps) => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [weeklyRecords, setWeeklyRecords] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadAttendance();
    }
  }, [user]);

  const loadAttendance = () => {
    if (!user) return;
    const allAttendance = storageService.getAttendanceByUserId(user.id);

    // Check for today's record
    const today = new Date().toISOString().split('T')[0];
    const record = allAttendance.find(a => a.date === today);

    if (record) {
      setTodayRecord(record);
      if (record.checkIn && !record.checkOut) {
        setIsCheckedIn(true);
        setCheckInTime(record.checkIn);
      } else if (record.checkIn && record.checkOut) {
        setIsCheckedIn(false); // Already checked out
        setCheckInTime(record.checkIn);
      }
    }

    // Mock weekly data based on real data or just structure it
    // For now, let's keep the visualization simple or map real days
    // This is a simplification.
    setWeeklyRecords([
      { day: 'Mon', status: 'present', hours: '8h 30m' },
      { day: 'Tue', status: 'present', hours: '8h 15m' },
      { day: 'Wed', status: 'present', hours: '9h 00m' },
      { day: 'Thu', status: 'late', hours: '7h 45m' },
      { day: 'Fri', status: 'pending', hours: '-' },
    ]);
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
      status: 'present', // Logic to determine if late could go here
      workHours: '0h 0m'
    };

    storageService.addAttendance(newRecord);
    setCheckInTime(timeString);
    setIsCheckedIn(true);
    setTodayRecord(newRecord);
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
      workHours: '8h 30m' // Calculate actual diff in real app
    };

    storageService.updateAttendance(updatedRecord);
    setIsCheckedIn(false);
    setTodayRecord(updatedRecord);
  };

  return (
    <FloatingCard className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Check In/Out Section */}
        <div className="flex-shrink-0 lg:w-64">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
            Today's Attendance
          </h3>

          <div className="rounded-xl bg-secondary/30 p-6 text-center">
            <motion.div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${isCheckedIn ? 'bg-success/20' : 'bg-muted'
                }`}
              animate={{
                scale: isCheckedIn ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: isCheckedIn ? Infinity : 0,
              }}
            >
              <Clock
                className={`h-10 w-10 ${isCheckedIn ? 'text-success' : 'text-muted-foreground'
                  }`}
              />
            </motion.div>

            {todayRecord?.checkOut ? (
              <>
                <p className="text-sm text-muted-foreground">Work day completed</p>
                <p className="font-display text-xl font-bold text-foreground">
                  {todayRecord.workHours}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Check In: {todayRecord.checkIn}<br />
                  Check Out: {todayRecord.checkOut}
                </div>
              </>
            ) : isCheckedIn ? (
              <>
                <p className="text-sm text-muted-foreground">Checked in at</p>
                <p className="font-display text-2xl font-bold text-success">
                  {checkInTime}
                </p>
                <MagneticButton
                  variant="secondary"
                  size="md"
                  className="mt-4 w-full"
                  onClick={handleCheckOut}
                >
                  <LogOut className="h-4 w-4" />
                  Check Out
                </MagneticButton>
              </>
            ) : (
              <>
                <p className="mb-4 text-sm text-muted-foreground">
                  You haven't checked in yet
                </p>
                <MagneticButton
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleCheckIn}
                >
                  <LogIn className="h-4 w-4" />
                  Check In
                </MagneticButton>
              </>
            )}
          </div>
        </div>

        {/* Weekly View */}
        <div className="flex-1">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
            This Week
          </h3>

          <div className="grid grid-cols-5 gap-2">
            {weeklyRecords.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-xl p-3 text-center ${day.status === 'present'
                  ? 'bg-success/10 border border-success/20'
                  : day.status === 'late'
                    ? 'bg-warning/10 border border-warning/20'
                    : day.status === 'pending'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted/30 border border-transparent'
                  }`}
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {day.day}
                </p>
                <div className="my-2">
                  {day.status === 'present' ? (
                    <CheckCircle2 className="mx-auto h-5 w-5 text-success" />
                  ) : day.status === 'late' ? (
                    <AlertCircle className="mx-auto h-5 w-5 text-warning" />
                  ) : day.status === 'pending' ? (
                    <Clock className="mx-auto h-5 w-5 text-primary" />
                  ) : (
                    <div className="mx-auto h-5 w-5 rounded-full bg-muted" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{day.hours}</p>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/30 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Present: 3</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                <span className="text-sm text-muted-foreground">Late: 1</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Absent: 0</span>
              </div>
            </div>
            <p className="font-medium text-foreground">
              Total: <span className="text-primary">33h 30m</span>
            </p>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
};
