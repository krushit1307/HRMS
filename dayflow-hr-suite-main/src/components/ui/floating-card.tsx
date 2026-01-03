import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export const FloatingCard = ({
  children,
  className,
  delay = 0,
  hover = true,
}: FloatingCardProps) => {
  return (
    <motion.div
      className={cn(
        'floating-card rounded-2xl p-6',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={hover ? {
        y: -4,
        transition: { duration: 0.3 },
      } : undefined}
    >
      {children}
    </motion.div>
  );
};
