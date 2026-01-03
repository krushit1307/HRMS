import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, Clock, Calendar, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedBackground } from '@/components/effects/AnimatedBackground';
import { CursorGlow } from '@/components/effects/CursorGlow';
import { MagneticButton } from '@/components/ui/magnetic-button';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Users, title: 'Employee Management', description: 'Centralized employee profiles and data' },
    { icon: Clock, title: 'Attendance Tracking', description: 'Real-time check-in/out with reports' },
    { icon: Calendar, title: 'Leave Management', description: 'Streamlined leave requests & approvals' },
    { icon: Shield, title: 'Role-Based Access', description: 'Secure admin and employee portals' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBackground />
      <CursorGlow />

      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-primary">Dayflow</span>
          </div>
          <MagneticButton variant="primary" onClick={() => navigate('/auth')}>
            Get Started <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Modern HRMS for modern teams</span>
            </div>

            <h1 className="font-display text-5xl font-bold leading-tight md:text-7xl">
              <span className="text-gradient-primary">Streamline</span> your
              <br />workforce management
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              A premium Human Resource Management System designed to simplify attendance, 
              leave management, and payroll with an elegant, intuitive interface.
            </p>

            <div className="mt-10 flex justify-center gap-4">
              <MagneticButton variant="primary" size="lg" onClick={() => navigate('/auth')}>
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </MagneticButton>
              <MagneticButton variant="secondary" size="lg">
                Watch Demo
              </MagneticButton>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="floating-card rounded-2xl p-6 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Index;
