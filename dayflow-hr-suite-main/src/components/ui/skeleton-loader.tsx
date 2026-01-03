import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'default' | 'circular' | 'text';
}

export const SkeletonLoader = ({
  className,
  variant = 'default',
}: SkeletonLoaderProps) => {
  const variantStyles = {
    default: 'h-20 w-full rounded-xl',
    circular: 'h-12 w-12 rounded-full',
    text: 'h-4 w-3/4 rounded',
  };

  return (
    <div
      className={cn(
        'shimmer animate-pulse bg-muted',
        variantStyles[variant],
        className
      )}
    />
  );
};

export const CardSkeleton = () => (
  <div className="floating-card space-y-4 rounded-2xl p-6">
    <div className="flex items-center gap-4">
      <SkeletonLoader variant="circular" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader variant="text" className="w-1/2" />
        <SkeletonLoader variant="text" className="w-1/3" />
      </div>
    </div>
    <SkeletonLoader className="h-32" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    <SkeletonLoader className="h-12" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonLoader key={i} className="h-16" />
    ))}
  </div>
);
