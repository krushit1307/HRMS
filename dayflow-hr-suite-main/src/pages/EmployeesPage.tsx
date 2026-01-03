import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    MoreVertical,
    Mail,
    Phone,
    Briefcase,
    Building2,
    Trash2,
    Edit2,
    Shield,
    User as UserIcon,
    X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth, User } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';

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

const EmployeesPage = () => {
    const { user: currentUser } = useAuth();
    const [employees, setEmployees] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Employee Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        employeeId: '',
        role: 'employee' as 'admin' | 'employee' | 'hr',
        password: 'password123' // Default password
    });

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = () => {
        const allUsers = storageService.getUsers();
        setEmployees(allUsers);
    };

    const handleCreateEmployee = (e: React.FormEvent) => {
        e.preventDefault();

        const newUser: User = {
            id: crypto.randomUUID(),
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            employeeId: formData.employeeId || `EMP${Math.floor(Math.random() * 1000)}`,
            department: formData.department,
            position: formData.position,
            joinDate: new Date().toISOString().split('T')[0],
            phone: '',
            address: '',
        };

        storageService.addUser(newUser, formData.password);
        loadEmployees();
        setIsModalOpen(false);
        // Reset form
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            department: '',
            position: '',
            employeeId: '',
            role: 'employee',
            password: 'password123'
        });
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            Employees
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your organization's workforce
                        </p>
                    </div>
                    <MagneticButton
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add Employee
                    </MagneticButton>
                </motion.div>

                {/* Search and Filters */}
                <motion.div variants={itemVariants}>
                    <FloatingCard className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-lg border border-border bg-secondary/50 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            />
                        </div>
                    </FloatingCard>
                </motion.div>

                {/* Employees Grid */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {filteredEmployees.map((employee, index) => (
                        <FloatingCard key={employee.id} delay={index * 0.05}>
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                        {employee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-display text-lg font-semibold text-foreground">
                                            {employee.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{employee.position}</p>
                                    </div>
                                </div>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <MoreVertical className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    {employee.email}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Building2 className="h-4 w-4" />
                                    {employee.department}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4" />
                                    <span className="capitalize">{employee.role}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3 border-t border-border pt-4">
                                <MagneticButton variant="secondary" className="w-full" size="sm">
                                    View Profile
                                </MagneticButton>
                            </div>
                        </FloatingCard>
                    ))}
                </motion.div>
            </motion.div>

            {/* Add Employee Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="font-display text-2xl font-bold text-foreground">
                                    Add New Employee
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateEmployee} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Employee ID</label>
                                        <input
                                            type="text"
                                            value={formData.employeeId}
                                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                            placeholder="Auto-generated if empty"
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Department</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Position</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.position}
                                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="hr">HR</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Temporary Password</label>
                                        <input
                                            type="text"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
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
                                        Create Employee
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

export default EmployeesPage;
