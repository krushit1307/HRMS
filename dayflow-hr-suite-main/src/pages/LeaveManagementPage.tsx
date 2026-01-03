import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { storageService, LeaveRequest } from '@/services/storage';

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

const LeaveManagementPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'hr';
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);

  // Form State
  const [leaveType, setLeaveType] = useState<'paid' | 'sick' | 'unpaid'>('paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = () => {
    const allRequests = storageService.getLeaves();
    setRequests(allRequests);
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Simple day calculation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequest = {
      id: crypto.randomUUID(),
      userId: user.id,
      employeeName: user.name,
      type: leaveType,
      startDate,
      endDate,
      days: diffDays,
      status: 'pending',
      reason,
    };

    storageService.addLeave(newRequest);
    loadRequests();
    setIsModalOpen(false);
    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    const request = requests.find(r => r.id === id);
    if (request) {
      storageService.updateLeave({ ...request, status });
      loadRequests();
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (!isAdmin && req.userId !== user?.id) return false;
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

  // Calculate balances from storage or mock
  const leaveBalance = {
    paid: 12, // This could be calculated from storage too
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
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${type === 'paid'
                    ? 'bg-success/10'
                    : type === 'sick'
                      ? 'bg-destructive/10'
                      : 'bg-warning/10'
                    }`}
                >
                  <Calendar
                    className={`h-6 w-6 ${type === 'paid'
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
        <motion.div variants={itemVariants}>
          <FloatingCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Tabs */}
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors ${activeTab === tab
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
                className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          </FloatingCard>
        </motion.div>

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
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} className="py-8 text-center text-muted-foreground">
                        No leave requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request, index) => (
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
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'approved')}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/20 text-success transition-colors hover:bg-success/30"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateStatus(request.id, 'rejected')}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/20 text-destructive transition-colors hover:bg-destructive/30"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </FloatingCard>
        </motion.div>
      </motion.div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Apply for Leave
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      End Date
                    </label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Leave Type
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="paid">Paid Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Reason
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="Brief description of your leave..."
                    className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <MagneticButton
                    variant="secondary"
                    className="w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(false);
                    }}
                  >
                    Cancel
                  </MagneticButton>
                  <MagneticButton
                    variant="primary"
                    className="w-full"
                    type="submit"
                  >
                    Submit Application
                  </MagneticButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default LeaveManagementPage;
