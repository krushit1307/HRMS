import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    Download,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    Plus,
    X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth, User } from '@/contexts/AuthContext';
import { storageService, PayrollRecord } from '@/services/storage';

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

const PayrollPage = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin' || user?.role === 'hr';
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState<User[]>([]);

    // Form State
    const [selectedUserId, setSelectedUserId] = useState('');
    const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long' }));
    const [year, setYear] = useState(new Date().getFullYear());
    const [basicSalary, setBasicSalary] = useState(5000);
    const [allowances, setAllowances] = useState(500);
    const [deductions, setDeductions] = useState(200);

    useEffect(() => {
        if (user) {
            loadPayroll();
            if (isAdmin) {
                setEmployees(storageService.getUsers().filter(u => u.role === 'employee'));
            }
        }
    }, [user, isAdmin]);

    const loadPayroll = () => {
        if (!user) return;
        if (isAdmin) {
            setPayrollRecords(storageService.getPayroll());
        } else {
            setPayrollRecords(storageService.getPayrollByUserId(user.id));
        }
    };

    const handleCreatePayroll = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        const netSalary = Number(basicSalary) + Number(allowances) - Number(deductions);

        const newRecord: PayrollRecord = {
            id: crypto.randomUUID(),
            userId: selectedUserId,
            month,
            year,
            basicSalary: Number(basicSalary),
            allowances: Number(allowances),
            deductions: Number(deductions),
            netSalary,
            status: 'pending' // pending until paid?? For now just create it.
        };

        storageService.addPayroll(newRecord);
        loadPayroll();
        setIsModalOpen(false);
    };

    // Get employee name helper
    const getEmployeeName = (userId: string) => {
        const emp = storageService.getUsers().find(u => u.id === userId);
        return emp ? emp.name : 'Unknown';
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
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
                            Payroll
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {isAdmin ? 'Manage employee salaries and payments' : 'View your payslips and salary history'}
                        </p>
                    </div>
                    {isAdmin && (
                        <MagneticButton
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Process Payroll
                        </MagneticButton>
                    )}
                </motion.div>

                {/* Stats Logic (Mock for now or calculate) */}
                {/* ... */}

                {/* Payroll Table */}
                <motion.div variants={itemVariants}>
                    <FloatingCard>
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="font-display text-lg font-semibold text-foreground">
                                Payment History
                            </h3>
                            <div className="flex gap-2">
                                <MagneticButton variant="ghost" size="sm">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </MagneticButton>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        {isAdmin && (
                                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                                Employee
                                            </th>
                                        )}
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Period
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Basic Salary
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Allowances
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Deductions
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Net Salary
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payrollRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan={isAdmin ? 8 : 7} className="py-8 text-center text-muted-foreground">
                                                No payroll records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        payrollRecords.map((record, index) => (
                                            <motion.tr
                                                key={record.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-b border-border/50 transition-colors hover:bg-muted/30"
                                            >
                                                {isAdmin && (
                                                    <td className="px-4 py-4 font-medium text-foreground">
                                                        {getEmployeeName(record.userId)}
                                                    </td>
                                                )}
                                                <td className="px-4 py-4 text-foreground">
                                                    {record.month} {record.year}
                                                </td>
                                                <td className="px-4 py-4 text-foreground">
                                                    ${record.basicSalary.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 text-success">
                                                    +${record.allowances.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 text-destructive">
                                                    -${record.deductions.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="font-display font-bold text-primary">
                                                        ${record.netSalary.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success capitalize">
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <MagneticButton variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </MagneticButton>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </FloatingCard>
                </motion.div>
            </motion.div>

            {/* Add Payroll Modal */}
            <AnimatePresence>
                {isModalOpen && isAdmin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-display text-2xl font-bold text-foreground">
                                    Process Payroll
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePayroll} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Employee</label>
                                    <select
                                        required
                                        value={selectedUserId}
                                        onChange={(e) => setSelectedUserId(e.target.value)}
                                        className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Month</label>
                                        <select
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            {months.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Year</label>
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Basic Salary ($)</label>
                                    <input
                                        type="number"
                                        value={basicSalary}
                                        onChange={(e) => setBasicSalary(Number(e.target.value))}
                                        className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Allowances ($)</label>
                                        <input
                                            type="number"
                                            value={allowances}
                                            onChange={(e) => setAllowances(Number(e.target.value))}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Deductions ($)</label>
                                        <input
                                            type="number"
                                            value={deductions}
                                            onChange={(e) => setDeductions(Number(e.target.value))}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="rounded-xl bg-primary/10 p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-foreground">Net Salary</span>
                                        <span className="text-xl font-bold text-primary">
                                            ${(Number(basicSalary) + Number(allowances) - Number(deductions)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <MagneticButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </MagneticButton>
                                    <MagneticButton
                                        variant="primary"
                                        className="w-full"
                                        type="submit"
                                    >
                                        Generate Record
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

export default PayrollPage;
