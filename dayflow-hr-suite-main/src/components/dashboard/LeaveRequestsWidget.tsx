import { motion } from 'framer-motion';
import { Check, X, Clock, User, Calendar } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';

interface LeaveRequest {
  id: string;
  name: string;
  type: 'sick' | 'paid' | 'unpaid';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
}

const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    type: 'paid',
    startDate: 'Jan 15, 2025',
    endDate: 'Jan 17, 2025',
    status: 'pending',
    days: 3,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    type: 'sick',
    startDate: 'Jan 14, 2025',
    endDate: 'Jan 14, 2025',
    status: 'pending',
    days: 1,
  },
  {
    id: '3',
    name: 'Emily Davis',
    type: 'unpaid',
    startDate: 'Jan 20, 2025',
    endDate: 'Jan 25, 2025',
    status: 'pending',
    days: 6,
  },
];

export const LeaveRequestsWidget = () => {
  const getTypeColor = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'sick':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'paid':
        return 'bg-success/20 text-success border-success/30';
      case 'unpaid':
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  return (
    <FloatingCard>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Pending Leave Requests
        </h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
          {leaveRequests.length}
        </span>
      </div>

      <div className="space-y-3">
        {leaveRequests.map((request, index) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-xl border border-border bg-secondary/30 p-4 transition-all hover:border-primary/30 hover:bg-secondary/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-medium">
                  {request.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{request.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${getTypeColor(
                        request.type
                      )}`}
                    >
                      {request.type} leave
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.days} day{request.days > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success transition-colors hover:bg-success/30">
                  <Check className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20 text-destructive transition-colors hover:bg-destructive/30">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {request.startDate} - {request.endDate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <MagneticButton variant="ghost" size="sm">
          View All Requests
        </MagneticButton>
      </div>
    </FloatingCard>
  );
};
