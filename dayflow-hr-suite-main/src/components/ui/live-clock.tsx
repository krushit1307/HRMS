import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveClockProps {
  className?: string;
  showDate?: boolean;
}

export const LiveClock = ({ className, showDate = true }: LiveClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={cn('text-center', className)}>
      <motion.div
        className="font-display text-4xl font-bold tracking-tight text-gradient-primary"
        key={time.getSeconds()}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {formatTime(time)}
      </motion.div>
      {showDate && (
        <p className="mt-1 text-sm text-muted-foreground">{formatDate(time)}</p>
      )}
    </div>
  );
};
