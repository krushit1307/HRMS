import { motion } from 'framer-motion';
import { User, Calendar, Clock, FileCheck, DollarSign } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';

interface Activity {
  id: string;
  type: 'leave' | 'attendance' | 'payroll' | 'profile';
  title: string;
  description: string;
  time: string;
  user?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'leave',
    title: 'Leave Approved',
    description: 'Your vacation request was approved',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'attendance',
    title: 'Check-in Recorded',
    description: 'Successfully checked in at 9:02 AM',
    time: '4 hours ago',
  },
  {
    id: '3',
    type: 'payroll',
    title: 'Payslip Available',
    description: 'December 2024 payslip is ready',
    time: '1 day ago',
  },
  {
    id: '4',
    type: 'profile',
    title: 'Profile Updated',
    description: 'Contact information updated',
    time: '2 days ago',
  },
];

export const RecentActivityWidget = () => {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'leave':
        return Calendar;
      case 'attendance':
        return Clock;
      case 'payroll':
        return DollarSign;
      case 'profile':
        return User;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'leave':
        return 'bg-primary/20 text-primary';
      case 'attendance':
        return 'bg-success/20 text-success';
      case 'payroll':
        return 'bg-warning/20 text-warning';
      case 'profile':
        return 'bg-accent/20 text-accent';
    }
  };

  return (
    <FloatingCard>
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
        Recent Activity
      </h3>

      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 h-full w-px bg-border" />

        {activities.map((activity, index) => {
          const Icon = getIcon(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-4"
            >
              <div
                className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getColor(
                  activity.type
                )}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 pb-4">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </FloatingCard>
  );
};
