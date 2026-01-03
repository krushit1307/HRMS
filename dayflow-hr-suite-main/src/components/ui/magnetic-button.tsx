import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export const MagneticButton = ({
  children,
  className,
  onClick,
  disabled,
  variant = 'primary',
  size = 'md',
  type = 'button',
}: MagneticButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:shadow-glow',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:border-primary/50',
    ghost: 'bg-transparent text-foreground hover:bg-muted',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={cn(
        'relative inline-flex items-center justify-center gap-2 rounded-xl font-display font-medium transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15, mass: 0.5 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect for primary variant */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary opacity-0"
          whileHover={{ opacity: 0.2, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          style={{ filter: 'blur(20px)' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};
