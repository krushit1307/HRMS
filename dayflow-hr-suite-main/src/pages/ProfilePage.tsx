import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Edit2,
  Camera,
  Shield,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FloatingCard } from '@/components/ui/floating-card';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { useAuth } from '@/contexts/AuthContext';

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

const ProfilePage = () => {
  const { user } = useAuth();

  const profileData = {
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+1 (555) 123-4567',
    address: user?.address || '123 Main Street, City',
    department: user?.department || 'Engineering',
    position: user?.position || 'Senior Developer',
    employeeId: user?.employeeId || 'EMP001',
    joinDate: user?.joinDate || '2023-01-15',
    role: user?.role || 'employee',
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
  }) => (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/30 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your personal information and settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div variants={itemVariants}>
            <FloatingCard className="text-center">
              {/* Avatar */}
              <div className="relative mx-auto mb-4 h-32 w-32">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 text-4xl font-bold text-primary">
                  {profileData.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110">
                  <Camera className="h-5 w-5" />
                </button>
                {/* Status indicator */}
                <div className="absolute bottom-2 left-2 h-4 w-4 rounded-full border-2 border-card bg-success" />
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground">
                {profileData.name}
              </h2>
              <p className="text-muted-foreground">{profileData.position}</p>

              {/* Role Badge */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium capitalize text-primary">
                  {profileData.role}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary/30 p-4">
                  <p className="font-display text-2xl font-bold text-foreground">
                    248
                  </p>
                  <p className="text-xs text-muted-foreground">Days Present</p>
                </div>
                <div className="rounded-xl bg-secondary/30 p-4">
                  <p className="font-display text-2xl font-bold text-foreground">
                    12
                  </p>
                  <p className="text-xs text-muted-foreground">Leave Balance</p>
                </div>
              </div>

              <MagneticButton variant="secondary" className="mt-6 w-full">
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </MagneticButton>
            </FloatingCard>
          </motion.div>

          {/* Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <FloatingCard>
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Personal Information
                </h3>
                <MagneticButton variant="ghost" size="sm">
                  <Edit2 className="h-4 w-4" />
                  Edit
                </MagneticButton>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem icon={Mail} label="Email Address" value={profileData.email} />
                <InfoItem icon={Phone} label="Phone Number" value={profileData.phone} />
                <InfoItem icon={MapPin} label="Address" value={profileData.address} />
                <InfoItem icon={Calendar} label="Join Date" value={profileData.joinDate} />
                <InfoItem icon={Briefcase} label="Position" value={profileData.position} />
                <InfoItem icon={Building2} label="Department" value={profileData.department} />
              </div>

              {/* Employee ID */}
              <div className="mt-6 rounded-xl border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee ID</p>
                    <p className="font-display text-xl font-bold text-primary">
                      {profileData.employeeId}
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/10 px-4 py-2">
                    <p className="text-sm font-medium text-primary">Active</p>
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Security Settings */}
            <FloatingCard className="mt-6">
              <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
                Security Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <MagneticButton variant="secondary" size="sm">
                    Change
                  </MagneticButton>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-secondary/30 p-4">
                  <div>
                    <p className="font-medium text-foreground">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <MagneticButton variant="primary" size="sm">
                    Enable
                  </MagneticButton>
                </div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ProfilePage;
