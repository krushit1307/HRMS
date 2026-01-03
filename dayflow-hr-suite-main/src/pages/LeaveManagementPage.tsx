import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  Search,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth } from '@/contexts/AuthContext';

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

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeName: 'Sarah Chen',
    type: 'paid',
    startDate: '2025-01-15',
    endDate: '2025-01-17',
    days: 3,
    status: 'pending',
    reason: 'Family vacation',
  },
  {
    id: '2',
    employeeName: 'Mike Johnson',
    type: 'sick',
    startDate: '2025-01-10',
    endDate: '2025-01-10',
    days: 1,
    status: 'approved',
    reason: 'Medical appointment',
  },
  {
    id: '3',
    employeeName: 'Emily Davis',
    type: 'unpaid',
    startDate: '2025-01-20',
    endDate: '2025-01-25',
    days: 6,
    status: 'rejected',
    reason: 'Personal matters',
  },
  {
    id: '4',
    employeeName: 'You',
    type: 'paid',
    startDate: '2025-02-01',
    endDate: '2025-02-05',
    days: 5,
    status: 'pending',
    reason: 'Vacation',
  },
];

const LeaveManagementPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRequests = mockLeaveRequests.filter((req) => {
    if (!isAdmin) return req.employeeName === 'You';
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
    }
  };

  const getTypeBadge = (type: LeaveRequest['type']) => {
    switch (type) {
      case 'paid':
        return 'bg-success/20 text-success border-success/30';
      case 'sick':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'unpaid':
        return 'bg-warning/20 text-warning border-warning/30';
    }
  };

  const leaveBalance = {
    paid: 12,
    sick: 5,
    unpaid: 'Unlimited',
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
              Leave Management
            </h1>
            <p className="mt-1 text-muted-foreground">
              {isAdmin ? 'Review and manage leave requests' : 'Apply for leave and track your requests'}
            </p>
          </div>
          <MagneticButton
            variant="primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Apply for Leave
          </MagneticButton>
        </motion.div>

        {/* Leave Balance Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {Object.entries(leaveBalance).map(([type, balance], index) => (
            <FloatingCard key={type} delay={index * 0.1}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    type === 'paid'
                      ? 'bg-success/10'
                      : type === 'sick'
                      ? 'bg-destructive/10'
                      : 'bg-warning/10'
                  }`}
                >
                  <Calendar
                    className={`h-6 w-6 ${
                      type === 'paid'
                        ? 'text-success'
                        : type === 'sick'
                        ? 'text-destructive'
                        : 'text-warning'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm capitalize text-muted-foreground">
                    {type} Leave
                  </p>
                  <p className="font-display text-2xl font-bold text-foreground">
                    {balance}
                    {typeof balance === 'number' && (
                      <span className="text-sm font-normal text-muted-foreground">
                        {' '}
                        days
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </FloatingCard>
          ))}
        </motion.div>

        {/* Filters */}
        {isAdmin && (
          <motion.div variants={itemVariants}>
            <FloatingCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Tabs */}
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </FloatingCard>
          </motion.div>
        )}

        {/* Leave Requests Table */}
        <motion.div variants={itemVariants}>
          <FloatingCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {isAdmin ? 'Employee' : 'Request'}
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Days
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    {isAdmin && (
                      <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group border-b border-border/50 transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {request.employeeName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {request.reason}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getTypeBadge(
                            request.type
                          )}`}
                        >
                          {request.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground">
                        {request.startDate} - {request.endDate}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-display text-lg font-bold text-foreground">
                          {request.days}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusBadge(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-4">
                          {request.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success transition-colors hover:bg-success/30">
                                <Check className="h-4 w-4" />
                              </button>
                              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20 text-destructive transition-colors hover:bg-destructive/30">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Showing 1-{filteredRequests.length} of {filteredRequests.length} requests
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
      </motion.div>

      {/* Apply Leave Modal would go here */}
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
