import { motion } from 'framer-motion';
import { UserCheck, Clock, FileText, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface QuickStatsWidgetProps {
  isAdmin: boolean;
}

export const QuickStatsWidget = ({ isAdmin }: QuickStatsWidgetProps) => {
  const adminStats = [
    { label: 'Active Projects', value: 24, icon: FileText, color: 'primary', prefix: '', suffix: '' },
    { label: 'Pending Approvals', value: 8, icon: Clock, color: 'warning', prefix: '', suffix: '' },
    { label: 'Monthly Payroll', value: 125000, prefix: '$', icon: DollarSign, color: 'success', suffix: '' },
  ];

  const employeeStats = [
    { label: 'Leave Balance', value: 12, suffix: ' days', icon: Calendar, color: 'primary', prefix: '' },
    { label: 'Pending Requests', value: 1, icon: Clock, color: 'warning', prefix: '', suffix: '' },
    { label: 'This Month Salary', value: 5400, prefix: '$', icon: DollarSign, color: 'success', suffix: '' },
  ];

  const stats = isAdmin ? adminStats : employeeStats;

  return (
    <FloatingCard>
      <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
        Quick Stats
      </h3>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 rounded-xl bg-secondary/30 p-4"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                stat.color === 'primary'
                  ? 'bg-primary/10'
                  : stat.color === 'warning'
                  ? 'bg-warning/10'
                  : 'bg-success/10'
              }`}
            >
              <stat.icon
                className={`h-5 w-5 ${
                  stat.color === 'primary'
                    ? 'text-primary'
                    : stat.color === 'warning'
                    ? 'text-warning'
                    : 'text-success'
                }`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                className="font-display text-xl font-bold text-foreground"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance indicator */}
      <div className="mt-4 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <span className="text-sm font-medium text-foreground">
              {isAdmin ? 'Team Performance' : 'Your Performance'}
            </span>
          </div>
          <span className="font-display text-lg font-bold text-success">+12%</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Compared to last month
        </p>
      </div>
    </FloatingCard>
  );
};
