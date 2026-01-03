import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PollutantCardProps {
  name: string;
  value: number;
  unit: string;
  limit: number;
  className?: string;
}

export function PollutantCard({ name, value, unit, limit, className }: PollutantCardProps) {
  const percentage = Math.min((value / limit) * 100, 100);
  const isExceeding = value > limit;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg bg-secondary/50 border border-border/50',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className={cn(
          'text-lg font-bold',
          isExceeding ? 'text-danger' : 'text-foreground'
        )}>
          {value}
          <span className="text-xs text-muted-foreground ml-1">{unit}</span>
        </span>
      </div>
      
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isExceeding ? 'bg-danger' : 'bg-primary'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">0</span>
        <span className="text-xs text-muted-foreground">Limit: {limit}</span>
      </div>
    </motion.div>
  );
}
